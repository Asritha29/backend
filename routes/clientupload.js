const express = require('express');
const router = express.Router();
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const Client = require('../model/client');

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const XLSX_EXTENSION = '.xlsx';

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/clientUpload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    if (req.file.mimetype !== XLSX_MIME_TYPE || !req.file.originalname.endsWith(XLSX_EXTENSION)) {
      return res.status(400).json({ error: 'Invalid file type. Please upload an Excel (.xlsx) file.' });
    }

    const rows = await readXlsxFile(req.file.buffer);
    if (!rows || rows.length === 0) {
      throw new Error('Empty file or invalid format.');
    }
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {})
    );

    const clientPromises = data.map(async (clientData) => {
      try {
        const { clientEmail } = clientData;
        let existingClient = await Client.findOne({ clientEmail });
        if (!existingClient) {
          const newClient = new Client({
            ...clientData,
            user: userId, 
          });
          await newClient.save();
        } else {
          console.warn(`Client already exists: ${clientEmail}`);
        }

        return { success: true, clientEmail };
      } catch (error) {
        console.error('Error processing client:', error);
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(clientPromises);

    const errors = results
      .filter(result => result.status === 'rejected' || !result.value.success)
      .map(result => result.reason || result.value);

    res.status(200).json({
      message: 'Data uploaded and processed successfully',
      errors: errors.length > 0 ? errors : null
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file: ' + error.message });
  }
});

module.exports = router;
