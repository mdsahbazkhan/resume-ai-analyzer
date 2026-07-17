const ai = require("../config/gemini");

const extractSkills = async (text) => {
  const prompt = `
You are an ATS skill extraction assistant.

Extract ONLY technical skills from the following text.

Rules:
- Return ONLY valid JSON.
- No markdown.
- No explanation.
- Remove duplicate skills.
- Include programming languages, frameworks, libraries, databases, cloud tools, DevOps tools, testing tools, and other technical skills.

Format:
{
  "skills": []
}

Text:
${text}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  let result = response.text.trim();

  // Remove markdown if Gemini wraps JSON
  result = result.replace(/```json|```/g, "").trim();

  return JSON.parse(result);
};

module.exports = { extractSkills };
