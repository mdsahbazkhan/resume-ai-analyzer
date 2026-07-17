

const ai = require("../config/gemini");

const DENYLIST = new Set([
  "ai",
  "agents",
  "iot",
  "deeptech",
  "chatgpt",
  "claude",
  "claudecode",
  "gemini",
  "copilot",
  "cursor",
  "windsurf",
  "perplexity",
  "bard",
  "fullstack",
  "fullstackdevelopment",
  "webdevelopment",
  "appdevelopment",
  "softwaredevelopment",
  "programming",
]);

const normalizeForDenylist = (skill) =>
  skill.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

const filterSkills = (skills) =>
  skills.filter((skill) => !DENYLIST.has(normalizeForDenylist(skill)));

const extractSkills = async (text) => {
  const prompt = `
You are an expert ATS resume parser.

Extract ONLY core technical skills that are relevant for matching a candidate to a job.
Keep specific technology names as their own entry — do NOT collapse a specific tool into
a broader category (e.g. keep "MongoDB", "PostgreSQL", "Git", "GitHub", "AWS", "LangChain"
as themselves, not as "Databases" or "Cloud Platforms").

Include:
- Programming languages, frameworks, libraries
- Databases, cloud platforms, DevOps tools, version control tools
- Operating systems, APIs
- AI/ML frameworks and AI technologies (Generative AI, LLMs, RAG, Prompt Engineering, Vector
  Databases, Embeddings, AI Agents, LangChain, HuggingFace, Groq, etc.)
- A broad skill CATEGORY when the text asks for a category rather than a specific tool — e.g.
  "experience with databases" -> extract "Databases"; "cloud platform experience" ->
  extract "Cloud Platforms"; "version control" -> extract "Version Control". Keep this as
  its own entry, separate from any specific technology also mentioned nearby.

Do NOT include, under any circumstances:
- Company names, product names, or platform names (e.g. UniIntern, Sannidhi)
- AI assistant/tool brand names (ChatGPT, Claude, Claude Code, Gemini, Copilot, Cursor, Windsurf, Perplexity, etc.) — even if the job description lists them as tools to use. These are tools, not skills. If the text emphasizes "AI-fluency" or using AI tools, extract that concept as "AI Tools Proficiency" instead of any brand name.
- Job responsibilities or duties (e.g. "own things end-to-end", "cross-functional collaboration")
- Soft skills (e.g. "fast learner", "builder's mindset", "resourceful")
- Vague ROLE descriptors that name a kind of developer rather than a skill (e.g. "Web
  Development", "App Development", "Software Development", "Full Stack", "Programming")
- Location names, years of experience, or team-size descriptors

Do not include any text before or after the JSON.
Do not use markdown.
If multiple names refer to the same skill, return only the canonical name.

Examples:
React.js -> React
Node.js -> Node.js
JavaScript (ES6+) -> JavaScript
REST APIs -> REST API
Tailwind CSS -> Tailwind CSS
"Experience with databases (SQL or NoSQL)" -> Databases
"Cloud platform experience (AWS/Azure/GCP)" -> Cloud Platforms
"Version control (Git)" -> Version Control, Git
Claude, ChatGPT, Gemini (as tools to use) -> AI Tools Proficiency

Return:

{
  "skills": []
}

Text:
${text}
`;

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });
  } catch (error) {
    const isRateLimit = error?.status === 429;
    const serviceError = new Error(
      isRateLimit
        ? "AI service quota exceeded. Please try again in a minute."
        : "AI service is unavailable right now. Please try again.",
    );
    serviceError.status = isRateLimit ? 429 : 502;
    throw serviceError;
  }

  let result = response.text.trim();
  result = result.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(result);
  } catch {
    const parseError = new Error(
      "AI returned an unreadable response. Please try again.",
    );
    parseError.status = 502;
    throw parseError;
  }

  return { skills: filterSkills(parsed.skills || []) };
};

module.exports = { extractSkills };