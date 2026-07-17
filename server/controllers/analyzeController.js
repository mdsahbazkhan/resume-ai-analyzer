const { extractTextFromPDF } = require("../services/pdfService.js");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume and Job Description are required.",
      });
    }
    const resumePath = req.file.path;
    const jobDescription = req.body.jobDescription;

    const resumeText = await extractTextFromPDF(resumePath);
    const jdText = jobDescription;

    res.status(200).json({
      success: true,
      data: {
        resumeText,
        jdText,
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
