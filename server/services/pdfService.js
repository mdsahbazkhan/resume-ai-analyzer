const fs = require("fs/promises");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const data = await pdf(buffer);
  return data.text;
};

module.exports = { extractTextFromPDF };
