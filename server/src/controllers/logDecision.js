const axios = require("axios");
const { storeDecision, getAllDecisions } = require("../utils/storage");

exports.logDecision = async (req, res) => {
  const decision = req.body;
  if (!decision.title) return res.status(400).json({ error: "Missing decision data" });

  try {
    // Store locally
    storeDecision(decision);

    // Forward to n8n webhook if URL is configured
    if (process.env.N8N_WEBHOOK_URL) {
      await axios.post(process.env.N8N_WEBHOOK_URL, decision);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to log decision" });
  }
};

exports.getDecisions = (req, res) => {
  res.json(getAllDecisions());
};