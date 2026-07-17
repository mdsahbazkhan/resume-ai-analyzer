const { extractTextFromPDF } = require("../services/pdfService.js");
const { extractSkills } = require("../services/geminiService.js");
const { compareSkills } = require("../services/compareService.js");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume and Job Description are required.",
      });
    }
    const resumePath = req.file.path;
    const jdText = req.body.jobDescription;

    const resumeText = await extractTextFromPDF(resumePath);

    const [resumeSkillsResult, jdSkillsResult] = await Promise.all([
      extractSkills(resumeText),
      extractSkills(jdText),
    ]);

    const { matchedSkills, missingSkills, matchPercentage } = compareSkills(
      resumeSkillsResult.skills,
      jdSkillsResult.skills
    );

    res.status(200).json({
      success: true,
      data: {
        resumeSkills: resumeSkillsResult.skills,
        jdSkills: jdSkillsResult.skills,
        matchedSkills,
        missingSkills,
        matchPercentage,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { analyzeResume };
