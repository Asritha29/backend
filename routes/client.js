const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Client = require('../model/client');


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
const workOrder = multer({ storage: storage });

router.post('/client', workOrder.single('file'), async (req, res) => {
  try {

    const {
      clientName, 
      contName, 
      conNumber, 
      clientEmail, 
      address, 
      ismainClient, 
      mainClient, 
      // mainClientId, 
      gstNumber, 
      status,
      contractStart,
      contractEnd,
    } = req.body;

    const clientData = {
      clientName, 
      contName, 
      conNumber, 
      clientEmail, 
      address, 
      ismainClient, 
      mainClient, 
      // mainClientId, 
      gstNumber, 
      status, 
      contractStart,
      contractEnd,
    };

    if (req.file) {
      const { filename } = req.file;
      const fileUrl = `http://globusit-env.eba-5wfvbmm7.ap-south-1.elasticbeanstalk.com/uploads/${filename}`;
      clientData.workOrder = fileUrl;  
    }

    const newClient = new Client(clientData);
    await newClient.save();

    res.json({ status: 'success', workOrder: clientData.workOrder || null });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;