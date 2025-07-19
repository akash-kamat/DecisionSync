const tesseractOcr = require("../utils/tesseractOcr");

exports.ocr = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image uploaded" });
    const text = await tesseractOcr(file.buffer);
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: "OCR failed" });
  }
};