const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
dotenv.config();

// Initialize express and middleware
const app = express();
const upload = multer();

app.use(express.json());
app.use(express.text());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
}));

// In-memory storage
let decisions = [];

// Helper Functions
const storeDecision = (decision) => {
  decisions.push({ ...decision, created: new Date().toISOString() });
};

const getAllDecisions = () => decisions.slice().reverse();

const systemPrompt = `
Extract structured data from this input. Return JSON with:
- title (string)
- summary (1–2 sentence string)
- owners (array of names)
- due_date (ISO format if found)
- related_jira_key (string if present)

Input: {{text}}
`;

async function openaiExtract(decisionText) {
  const prompt = systemPrompt.replace("{{text}}", decisionText);
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Prompt sent to AI:", prompt);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI failed to extract JSON");
  return JSON.parse(match[0]);
}

async function imageToText(buffer) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const base64Image = buffer.toString('base64');
  const mimeType = "image/jpeg";
  const prompt = "Extract only the raw text from this image. Don't add any descriptions, labels, or explanations. Output the text exactly as it appears, maintaining only line breaks. No additional formatting or commentary.";

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    throw new Error('Failed to process image with Gemini Vision API');
  }
}

// API Routes
app.post("/api/parse-decision", async (req, res) => {
  const text = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const extracted = await openaiExtract(text);
    res.json(extracted);
  } catch (err) {
    res.status(500).json({ error: "AI parsing failed" });
  }
});

app.post("/api/log-decision", async (req, res) => {
  const decision = req.body;
  if (!decision.title) return res.status(400).json({ error: "Missing decision data" });

  try {
    // Store locally
    storeDecision(decision);
    
    if (process.env.N8N_WEBHOOK_URL) {
      await axios.post(process.env.N8N_WEBHOOK_URL, decision);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to log decision" });
  }
});

app.post("/api/ocr", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image uploaded" });
    const text = await imageToText(file.buffer);
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: "OCR failed" });
  }
});

app.get("/api/decisions", (req, res) => {
  res.json(getAllDecisions());
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
