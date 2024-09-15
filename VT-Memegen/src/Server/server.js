// server.js

import express from 'express';
import multer from 'multer';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {OpenAI} from 'openai';

const openai = new OpenAI({apiKey: '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'});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define __dirname and __filename for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable CORS for all routes (adjust origins as needed)
app.use(cors());

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Use path.join for cross-platform compatibility
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
    cb(new Error('Only .png, .jpg, and .jpeg formats are allowed!'));
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Endpoint to handle image upload and explanation
app.post('/api/explain-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = req.file.path;

    // Encode image in Base64
    const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
           {
            role: 'user',
            content: [
                {type: "text", text: "Explain this meme"},
                {
                    type: "image_url",
                    image_url: {
                      url: `data:image/jpeg;base64,${imageBase64}`
                    }
                  }
            ]
           }
        ],
    })

    const explanation = response.choices[0].message

    // Clean up the uploaded image after processing
    fs.unlinkSync(imagePath);

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
