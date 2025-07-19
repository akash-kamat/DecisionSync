const { openaiExtract } = require("../utils/openaiClient");

exports.parseDecision = async (req, res) => {
  const text = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const extracted = await openaiExtract(text);
    res.json(extracted);
  } catch (err) {
    res.status(500).json({ error: "AI parsing failed" });
  }
};