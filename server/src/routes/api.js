const express = require("express");
const multer = require("multer");
const { parseDecision } = require("../controllers/parseDecision");
const { logDecision } = require("../controllers/logDecision");
const { ocr } = require("../controllers/ocr");
const { getDecisions } = require("../controllers/logDecision");

const router = express.Router();
const upload = multer();

router.post("/parse-decision", express.text(), parseDecision);
router.post("/log-decision", logDecision);
router.post("/ocr", upload.single("image"), ocr);
router.get("/decisions", getDecisions);
router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports = router;