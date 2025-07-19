const { GoogleGenerativeAI } = require("@google/generative-ai");

async function imageToText(buffer) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Convert buffer to base64
  const base64Image = buffer.toString('base64');
  const mimeType = "image/jpeg"; // Adjust based on actual image type if needed

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

module.exports = imageToText;