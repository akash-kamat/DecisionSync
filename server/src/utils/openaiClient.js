const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt = `
Extract structured data from this input. Return JSON with:
- title (string)
- summary (1–2 sentence string)
- owners (array of names)
- due_date (ISO format if found)
- related_jira_key (string if present)

Input: {{text}}
`;

exports.openaiExtract = async (decisionText) => {
  const prompt = systemPrompt.replace("{{text}}", decisionText);
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Prompt sent to AI:", prompt);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(prompt);

  // Extract JSON from response
  const response = await result.response;
  const content = response.text();
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI failed to extract JSON");
  return JSON.parse(match[0]);
};