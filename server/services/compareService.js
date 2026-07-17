
const ai = require("../config/gemini"); 

const matchSkillsWithAI = async (resumeSkills, jdSkills) => {
  const prompt = `
You are matching a candidate's resume skills against a job description's required skills.

Treat skills as equivalent if they refer to the same underlying technology/concept,
even if worded differently (e.g. "AI Agents" = "Agents" = "Agentic AI",
"React.js" = "React" = "ReactJS", "REST APIs" = "REST API" = "REST",
"Node.js" = "Node" = "NodeJS").

Resume skills: ${JSON.stringify(resumeSkills)}
JD required skills: ${JSON.stringify(jdSkills)}

Return ONLY this JSON, no markdown, no extra text:
{
  "matchedSkills": [...jdSkills that have an equivalent in resumeSkills...],
  "missingSkills": [...jdSkills with no equivalent in resumeSkills...]
}
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

  const result = response.text
    .trim()
    .replace(/```json|```/g, "")
    .trim();

  try {
    return JSON.parse(result);
  } catch {
    const parseError = new Error(
      "AI returned an unreadable response. Please try again.",
    );
    parseError.status = 502;
    throw parseError;
  }
};

const compareSkills = async (resumeSkills = [], jdSkills = []) => {
  if (!jdSkills.length) {
    return { matchedSkills: [], missingSkills: [], matchPercentage: 0 };
  }

  const { matchedSkills, missingSkills } = await matchSkillsWithAI(
    resumeSkills,
    jdSkills,
  );

  const matchPercentage = Math.round(
    (matchedSkills.length / jdSkills.length) * 100,
  );

  return { matchedSkills, missingSkills, matchPercentage };
};

module.exports = { compareSkills };
