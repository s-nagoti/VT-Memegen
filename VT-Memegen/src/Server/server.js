import express from 'express'; // Import Express
import cors from 'cors'; // Import CORS
const app = express();
import {OpenAI} from 'openai'; // Import OpenAI
// Initialize OpenAI

const openai = new OpenAI({apiKey: 'sk-DzBaD5eLE89WbpgUZUbXcRFlOE71YFxD0qw7_-9a23T3BlbkFJeKywjlNn1R4cz1EGF8L-skUQF8uYuyA5XqBwCFeVIA'});

app.use(cors());


// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle image URL and explanation
app.post('/api/explain-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log('Image URL:', imageUrl);
    if (!imageUrl) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    // Use OpenAI API to generate explanation using the image URL directly
    const openaiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Adjust the model if necessary
      messages: [
        {
          role: 'user',
          content: [
            {type: 'text', text: "Please explain this meme as funny as possible"},
            {type: 'image_url', image_url: {url: 'https://firebasestorage.googleapis.com/v0/b/vthacks12-6ce70.appspot.com/o/posts%2FnpeuDzZMjEYIoygEh74r.jpg?alt=media&token=d960fcc0-258d-4b4e-aad3-c2029ec95a4e'}}
          ]
        }
      ],
    });

    const explanation = openaiResponse.choices[0].message

    // Respond with the explanation
    return res.json({ explanation });

  } catch (error) {
    console.error('Error processing image:', error.message);
    // Handle specific OpenAI API errors if needed
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data.error || 'Failed to process image' });
    }
    return res.status(500).json({ error: 'Failed to process image' });
  }
});

// Listen on port 5000
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
