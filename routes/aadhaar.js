const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs')
const Image = require('../model/image')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// const storage = multer.memoryStorage();
const pdf = multer({ storage: storage });

router.post('/upload', pdf.single('file'), async (req, res) => {
  try {
    console.log(req.file); 

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { title } = req.body;
    const { filename } = req.file;
    const fileUrl = `http://localhost:5006/uploads/${filename}`;
    const newImage = new Image({ title, url: fileUrl });
    await newImage.save();

    res.json({ status: 'success', url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
