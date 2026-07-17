const express = require("express");
const upload = require("../middleware/upload.js");
const { analyzeResume } = require("../controllers/analyzeController.js");

const router = express.Router();

router.post("/", upload.single("resume"), analyzeResume);

module.exports = router;
