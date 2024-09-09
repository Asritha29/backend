const express = require('express');
const router = express.Router();
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const Attendance = require('../model/attendance'); // Corrected model name

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/attendance', upload.single('file'), async (req, res) => {
  try {
    const { year, month } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const rows = await readXlsxFile(req.file.buffer);
    if (!rows || rows.length === 0) {
      throw new Error('Empty file or invalid format.');
    }

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      let rowData = {};
      row.forEach((cell, index) => {
        rowData[headers[index]] = cell;
      });
      return rowData;
    });

    // Process each row
    for (const row of data) {
      const empId = row['Employee ID']; // Extract empId from the row

      // Check if an attendance record already exists for this empId, year, and month
      const existingRecord = await Attendance.findOne({ empId, year, month });
      if (existingRecord) {
        console.log(`Attendance for Employee ID ${empId} for ${month}/${year} already exists. Skipping this record.`);
        continue; // Skip to the next row if a record exists
      }

      // Create a new attendance record
      const newAttendance = new Attendance({
        fullName1: row['Full Name'],  
        empId,   
        presentdays: row['Present Days'],
        absentdays: row['Absent Days'],
        incentives1:row['Incentives'],
        year,
        month
      });

      // Save the new attendance record
      await newAttendance.save();
    }

    res.status(200).json({ message: 'Data uploaded and saved to the database successfully. Duplicate records were skipped.' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file: ' + error.message });
  }
});

module.exports = router;
