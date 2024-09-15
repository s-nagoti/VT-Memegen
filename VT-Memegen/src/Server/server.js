// server.js

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes (Adjust origins as needed)
app.use(cors());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// Route to handle image upload and explanation
app.post('/api/explain-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = path.join(__dirname, req.file.path);
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    // Interact with OpenAI API
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/images/analysis', // Replace with the correct OpenAI endpoint
      {
        image: imageBase64,
        // Add any additional parameters as per OpenAI's API requirements
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // Assuming the API returns a field called 'description'
    const explanation = openaiResponse.data.description || 'No description available';

    // Clean up the uploaded image after processing
    fs.unlinkSync(imagePath);

    return res.json({ explanation });
  } catch (error) {
    console.error('Error processing image:', error.message);
    return res.status(500).json({ error: 'Failed to process image' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
