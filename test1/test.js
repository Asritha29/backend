// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Set up multer middleware
const upload = multer({ storage: storage });

// Create the upload endpoint
app.post('/upload', upload.array('documents', 10), (req, res) => {
  try {
    const files = req.files;
    if (!files) {
      return res.status(400).send('No files were uploaded.');
    }
    // Return the paths of uploaded files
    const fileUrls = files.map((file) => file.path);
    res.status(200).json({ message: 'Files uploaded successfully', files: fileUrls });
  } catch (error) {
    res.status(500).send('Error uploading files');
  }
});

// Start the server
const PORT = 5006;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
