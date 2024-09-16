import express from "express"; // Import Express
import cors from "cors"; // Import CORS
import { OpenAI } from "openai"; // Import OpenAI
// Initialize OpenAI
const app = express();

const firstHalfKey = 'sk-proj-n2ladxPX3efzgBh8Ly-HfR0NOw7uzUIvVF8EcDM-Q_Dh0UQZEZ5eQF8bUBJQuFmIIuRK7d9rnsT3BlbkFJgXML'
const secondHalfKey = '-JQ6Bg2kJldBY7mjQygX6zoApbyuNEDelOv0CgttLdgx5jDTerd6PJ7ZozsG8rZhIJZ2IA'
const apiKey = firstHalfKey + secondHalfKey
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
app.listen(5000, '0.0.0.0', () => {
  console.log("Server is running on http://localhost:5000");
});
