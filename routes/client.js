const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Client = require('../model/client');

// Set up storage with Multer
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

// Multer middleware
const workOrder = multer({ storage: storage });

// Client creation route with file upload
router.post('/client', workOrder.single('file'), async (req, res) => {
  try {
    console.log(req.file);
    
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Destructure request body
    const {
      clientName, 
      contName, 
      conNumber, 
      clientEmail, 
      address, 
      ismainClient, 
      mainClient, 
      gstNumber, 
      status,
      contractStart,
      contractEnd,
    } = req.body;

    // Extract filename and construct file URL
    const { filename } = req.file;
    const fileUrl = `http://localhost:5006/uploads/${filename}`;

    // Create a new Client document
    const newClient = new Client({
      clientName, 
      contName, 
      conNumber, 
      clientEmail, 
      address, 
      ismainClient, 
      mainClient, 
      gstNumber, 
      status, 
      workOrder: fileUrl,
      contractStart,
      contractEnd,
    });

    // Save the client to the database
    await newClient.save();

    // Respond with success and file URL
    res.json({ status: 'success', workOrder: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
