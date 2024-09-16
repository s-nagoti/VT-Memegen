import express from "express"; // Import Express
import cors from "cors"; // Import CORS
import { OpenAI } from "openai"; // Import OpenAI
import dotenv from "dotenv"; // Import dotenv
// Initialize OpenAI
const app = express();

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
console.log(`apiKey: ${apiKey}`);
const openai = new OpenAI({ apiKey: apiKey });

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle image URL and explanation
app.post("/api/explain-image", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log("Image URL:", imageUrl);
    if (!imageUrl) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    // Use OpenAI API to generate explanation using the image URL directly
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Adjust the model if necessary
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please explain this meme in detail. Rate it 1 out of 10 for funny and keep it under 5 sentences",
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const explanation = openaiResponse.choices[0].message;

    // Respond with the explanation
    return res.json({ explanation });
  } catch (error) {
    console.error("Error processing image:", error.message);
    // Handle specific OpenAI API errors if needed
    if (error.response) {
      return res
        .status(error.response.status)
        .json({
          error: error.response.data.error || "Failed to process image",
        });
    }
    return res.status(500).json({ error: "Failed to process image" });
  }
});

// Listen on port 5000
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
