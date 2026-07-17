const normalize = (skill) => {
  const cleaned = skill
    .trim()
    .toLowerCase()
    .replace(/[.\-\s]/g, "")
    .replace(/^(.+?)js$/, "$1"); // "react.js" / "reactjs" -> "react"

  return cleaned || skill.trim().toLowerCase();
};

const compareSkills = (resumeSkills = [], jdSkills = []) => {
  const resumeSet = new Set(resumeSkills.map(normalize));

  const matchedSkills = [];
  const missingSkills = [];

  jdSkills.forEach((skill) => {
    if (resumeSet.has(normalize(skill))) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchPercentage = jdSkills.length
    ? Math.round((matchedSkills.length / jdSkills.length) * 100)
    : 0;

  return { matchedSkills, missingSkills, matchPercentage };
};

module.exports = { compareSkills };
