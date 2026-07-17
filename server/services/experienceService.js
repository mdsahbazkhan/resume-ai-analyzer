const ai = require("../config/gemini");

const extractExperience = async (resumeText, jdText) => {
  const prompt = `
You are an ATS assistant that estimates work-experience fit.

From the RESUME, estimate the candidate's total professional work experience in years
(internships and jobs only — do NOT count years spent studying for a degree). Use decimals
for partial years (e.g. a 3-month internship = 0.25 years). If no work experience is found, return 0.

From the JOB DESCRIPTION, extract the MINIMUM years of experience required. If the JD says
something like "0-2 years", "freshers welcome", or doesn't mention experience at all, the
minimum is 0.

Return ONLY valid JSON, no markdown, no explanation:
{
  "candidateYears": number,
  "requiredMinYears": number
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
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

// No requirement (or a 0-year/"fresher" requirement) is a full match.
// Otherwise scale linearly up to the required minimum, capped at 100.
const calculateExperienceMatch = (candidateYears, requiredMinYears) => {
  if (!requiredMinYears || requiredMinYears <= 0) return 100;
  if (candidateYears >= requiredMinYears) return 100;
  return Math.max(0, Math.round((candidateYears / requiredMinYears) * 100));
};

module.exports = { extractExperience, calculateExperienceMatch };
