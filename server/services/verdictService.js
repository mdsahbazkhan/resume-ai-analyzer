const ai = require("../config/gemini");

const VALID_VERDICTS = ["Qualified", "Almost There", "Not Yet"];

const generateVerdict = async ({
  matchedSkills,
  missingSkills,
  matchPercentage,
  experienceMatchPercentage,
  overallMatchPercentage,
}) => {
  const prompt = `
You are an ATS assistant giving a hiring fit verdict for a candidate against a job description,
based on scores that have already been computed.

Computed match data:
- Matched skills: ${JSON.stringify(matchedSkills)}
- Missing skills: ${JSON.stringify(missingSkills)}
- Skill match: ${matchPercentage}%
- Experience match: ${experienceMatchPercentage}%
- Overall match: ${overallMatchPercentage}%

Base the verdict primarily on the Overall match percentage, using these thresholds:
- 75% or higher -> "Qualified"
- 45% to 74% -> "Almost There"
- below 45% -> "Not Yet"

Then give exactly 3 concise reasons (one sentence each) supporting the verdict. Reference specific
matched and missing skills by name from the lists above, and cover both strengths and gaps where relevant.

Return ONLY valid JSON, no markdown, no explanation:
{
  "verdict": "Qualified" | "Almost There" | "Not Yet",
  "reasons": ["reason 1", "reason 2", "reason 3"]
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
        : "AI service is unavailable right now. Please try again."
    );
    serviceError.status = isRateLimit ? 429 : 502;
    throw serviceError;
  }

  const result = response.text.trim().replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(result);
  } catch {
    const parseError = new Error("AI returned an unreadable response. Please try again.");
    parseError.status = 502;
    throw parseError;
  }
};


const normalizeVerdict = (verdict, overallMatchPercentage) => {
  const scoreDerived =
    overallMatchPercentage >= 75
      ? "Qualified"
      : overallMatchPercentage >= 45
        ? "Almost There"
        : "Not Yet";

  const match = VALID_VERDICTS.find(
    (v) => v.toLowerCase() === String(verdict).toLowerCase().trim()
  );

  return match ?? scoreDerived;
};

module.exports = { generateVerdict, normalizeVerdict };
