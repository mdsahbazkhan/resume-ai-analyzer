

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
]);

const normalizeForDenylist = (skill) =>
  skill.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

const filterSkills = (skills) =>
  skills.filter((skill) => !DENYLIST.has(normalizeForDenylist(skill)));

const extractSkills = async (text) => {
  const prompt = `
You are an expert ATS resume parser.

Extract ONLY core technical skills that are relevant for matching a candidate to a job.

Include:
- Programming languages
- Frameworks
- Libraries
- Databases
- Cloud platforms
- DevOps tools
- Version control
- Operating systems
- APIs
- AI/ML frameworks
- AI technologies (Generative AI, LLMs, RAG, Prompt Engineering, Vector Databases, Embeddings, AI Agents)

Do NOT include, under any circumstances:
- Company names, product names, or platform names (e.g. UniIntern, Sannidhi)
- AI assistant/tool brand names (ChatGPT, Claude, Claude Code, Gemini, Copilot, Cursor, Windsurf, Perplexity, etc.) — even if the job description lists them as tools to use. These are tools, not skills. If the text emphasizes "AI-fluency" or using AI tools, extract that concept as "AI Tools Proficiency" instead of any brand name.
- Job responsibilities or duties (e.g. "own things end-to-end", "cross-functional collaboration")
- Soft skills (e.g. "fast learner", "builder's mindset", "resourceful")
- Generic/vague phrases (e.g. "Web Development", "App Development", "Full Stack")
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