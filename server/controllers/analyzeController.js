const { extractTextFromPDF } = require("../services/pdfService.js");
const { extractSkills } = require("../services/geminiService.js");
const { compareSkills } = require("../services/compareService.js");
const {
  extractExperience,
  calculateExperienceMatch,
} = require("../services/experienceService.js");
const { generateVerdict, normalizeVerdict } = require("../services/verdictService.js");

// Weighting for the overall score: skills matter more than tenure for a technical hire,
// but experience level still meaningfully affects fit.
const SKILL_WEIGHT = 0.7;
const EXPERIENCE_WEIGHT = 0.3;

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

    let resumeText;
    try {
      resumeText = await extractTextFromPDF(resumePath);
    } catch {
      const pdfError = new Error("Could not read the PDF. Please upload a valid PDF resume.");
      pdfError.status = 400;
      throw pdfError;
    }

    const [resumeSkillsResult, jdSkillsResult, experienceResult] = await Promise.all([
      extractSkills(resumeText),
      extractSkills(jdText),
      extractExperience(resumeText, jdText),
    ]);

    const { matchedSkills, missingSkills, matchPercentage } = await compareSkills(
      resumeSkillsResult.skills,
      jdSkillsResult.skills
    );

    const { candidateYears, requiredMinYears } = experienceResult;
    const experienceMatchPercentage = calculateExperienceMatch(candidateYears, requiredMinYears);

    const overallMatchPercentage = Math.round(
      matchPercentage * SKILL_WEIGHT + experienceMatchPercentage * EXPERIENCE_WEIGHT
    );

    // Verdict is generated from the already-computed scores, not raw text, so
    // it can never contradict the percentages shown alongside it.
    const verdictResult = await generateVerdict({
      matchedSkills,
      missingSkills,
      matchPercentage,
      experienceMatchPercentage,
      overallMatchPercentage,
    });

    const verdict = normalizeVerdict(verdictResult.verdict, overallMatchPercentage);
    const reasons = Array.isArray(verdictResult.reasons) ? verdictResult.reasons.slice(0, 3) : [];

    res.status(200).json({
      success: true,
      data: {
        resumeSkills: resumeSkillsResult.skills,
        jdSkills: jdSkillsResult.skills,
        matchedSkills,
        missingSkills,
        matchPercentage,
        candidateYears,
        requiredMinYears,
        experienceMatchPercentage,
        overallMatchPercentage,
        verdict,
        reasons,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { analyzeResume };