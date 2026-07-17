const ai = require("../config/gemini");

const normalize = (skill) =>
  skill
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");


const SKILL_ALIASES = {
  reactjs: "react",
  react: "react",

  nodejs: "node.js",
  node: "node.js",

  nextjs: "next.js",
  next: "next.js",

  expressjs: "express",
  express: "express",

  js: "javascript",
  javascript: "javascript",

  reduxtoolkit: "redux",
  redux: "redux",

  tailwindcss: "tailwind",
  tailwind: "tailwind",

  restapis: "rest api",
  restapi: "rest api",

  postgresql: "postgresql",
  postgres: "postgresql",

  mongodb: "mongodb",
  mongo: "mongodb",

  chromadb: "chromadb",
  chroma: "chromadb",

  amazonwebservices: "aws",
  aws: "aws",

  googlecloud: "gcp",
  googlecloudplatform: "gcp",
  gcp: "gcp",

  microsoftazure: "azure",
  azure: "azure",

  huggingface: "huggingface",
  llamaindex: "llamaindex",
  semantickernel: "semantickernel",
};

const canonicalize = (skill) => {
  const key = normalize(skill);
  return SKILL_ALIASES[key] || key;
};


const SKILL_CATEGORIES = {
  mongodb: ["databases"],
  postgresql: ["databases"],
  mysql: ["databases"],
  redis: ["databases"],
  sqlite: ["databases"],
  dynamodb: ["databases"],
  chromadb: ["databases", "generativeai"],
  pinecone: ["databases", "generativeai"],

  git: ["versioncontrol"],
  github: ["versioncontrol"],
  gitlab: ["versioncontrol"],
  bitbucket: ["versioncontrol"],

  aws: ["cloudplatforms"],
  azure: ["cloudplatforms"],
  gcp: ["cloudplatforms"],

  langchain: ["llmframeworks", "generativeai"],
  llamaindex: ["llmframeworks", "generativeai"],
  semantickernel: ["llmframeworks", "generativeai"],

  huggingface: ["generativeai"],
  groq: ["generativeai"],
  rag: ["generativeai"],
  embeddings: ["generativeai"],
  promptengineering: ["generativeai"],
  aitoolsproficiency: ["generativeai"],
  aiagents: ["generativeai"],
  llmapis: ["generativeai", "apis"],
  vectordatabases: ["generativeai", "databases"],

  "rest api": ["apis"],
  graphql: ["apis"],
  grpc: ["apis"],
  soap: ["apis"],
  websockets: ["apis"],
  socketio: ["apis"],

  "node.js": ["backend"],
  express: ["backend"],
  fastapi: ["backend"],
  django: ["backend"],
  flask: ["backend"],
  springboot: ["backend"],
  dotnet: ["backend"],
};


const CATEGORY_PHRASE_ALIASES = {
  database: "databases",
  databases: "databases",
  versioncontrol: "versioncontrol",
  sourcecontrol: "versioncontrol",
  cloudplatform: "cloudplatforms",
  cloudplatforms: "cloudplatforms",
  cloudcomputing: "cloudplatforms",
  llmframework: "llmframeworks",
  llmframeworks: "llmframeworks",
  generativeai: "generativeai",
  genai: "generativeai",
  artificialintelligence: "generativeai",
  llm: "generativeai",
  llms: "generativeai",
  largelanguagemodels: "generativeai",
  agenticsystems: "generativeai",
  agenticai: "generativeai",
  aiagentsystems: "generativeai",
  api: "apis",
  apis: "apis",
  backend: "backend",
  backendsystems: "backend",
  backenddevelopment: "backend",
};

const getCategoriesFor = (canonicalSkill) =>
  SKILL_CATEGORIES[canonicalSkill] || [];


const deterministicMatch = (resumeSkills, jdSkills) => {
  const resumeCanonical = resumeSkills.map(canonicalize);
  const resumeCanonicalSet = new Set(resumeCanonical);
  const resumeCategorySet = new Set(resumeCanonical.flatMap(getCategoriesFor));

  const matched = [];
  const unresolved = [];

  jdSkills.forEach((skill) => {
    const canonical = canonicalize(skill);
    const category = CATEGORY_PHRASE_ALIASES[canonical];

    const isDirectMatch = resumeCanonicalSet.has(canonical);
    const isCategoryMatch = Boolean(category) && resumeCategorySet.has(category);

    if (isDirectMatch || isCategoryMatch) {
      matched.push(skill);
    } else {
      unresolved.push(skill);
    }
  });

  return { matched, unresolved };
};

const resolveUnmatchedWithAI = async (resumeSkills, unresolvedJdSkills) => {
  if (!unresolvedJdSkills.length) return { matchedSkills: [], missingSkills: [] };

  const prompt = `
You are matching a candidate's resume skills against job requirements that a rule-based
system could not confidently classify.

For each requirement below, decide if the candidate's resume skills satisfy it — either
directly (the same technology under a different name) or as a broader category that one of
the resume skills falls under (e.g. "Workflow Automation" could be satisfied by n8n, Zapier,
or Airflow experience).

Resume skills: ${JSON.stringify(resumeSkills)}
Requirements to check: ${JSON.stringify(unresolvedJdSkills)}

Return ONLY this JSON, no markdown, no extra text:
{
  "matchedSkills": [...requirements satisfied by the resume...],
  "missingSkills": [...requirements NOT satisfied...]
}
`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });
  } catch (error) {

    console.error("AI fallback skill match failed:", error.message);
    return { matchedSkills: [], missingSkills: unresolvedJdSkills };
  }

  const result = response.text.trim().replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(result);
    return {
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills)
        ? parsed.missingSkills
        : unresolvedJdSkills,
    };
  } catch {
    return { matchedSkills: [], missingSkills: unresolvedJdSkills };
  }
};

const compareSkills = async (resumeSkills = [], jdSkills = []) => {
  if (!jdSkills.length) {
    return { matchedSkills: [], missingSkills: [], matchPercentage: 0 };
  }

  const { matched, unresolved } = deterministicMatch(resumeSkills, jdSkills);
  const aiResolved = await resolveUnmatchedWithAI(resumeSkills, unresolved);

  const matchedSkills = [...matched, ...aiResolved.matchedSkills];
  const missingSkills = aiResolved.missingSkills;

  const matchPercentage = Math.round((matchedSkills.length / jdSkills.length) * 100);

  return { matchedSkills, missingSkills, matchPercentage };
};

module.exports = { compareSkills };
