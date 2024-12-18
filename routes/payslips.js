const express = require('express');
const router = express.Router();
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const Attendance = require('../model/attendance');
const Employee = require('../model/employee');

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

    for (const row of data) {
      const empId = row['Employee ID']; 
      const fullNameFromSheet = row['Full Name'];

      const employee = await Employee.findOne({ empId });
      if (!employee) {
        console.log(`Employee with ID ${empId} does not exist. Skipping.`);
        continue; 
      }

      if (employee.fullName !== fullNameFromSheet) {
        console.log(`Full name mismatch for Employee ID ${empId}. Skipping.`);
        continue; 
      }

      const existingRecord = await Attendance.findOne({ empId, year, month });
      if (existingRecord) {
        console.log(`Attendance for Employee ID ${empId} for ${month}/${year} already exists. Skipping this record.`);
        continue; 
      }

      const newAttendance = new Attendance({
        fullName1: fullNameFromSheet,  
        empId,   
        presentdays: row['Present Days'],
        absentdays: row['Absent Days'],
        incentives1: row['Incentives'],
        allowance1: row['Other Deductions'],
        spcialAllowances1: row['Spcial Allowances'],
        Arrears1: row['Arrears'],
        totalWorkingDays: row['Total Working Days'],
        year,
        month
      });
      await newAttendance.save();
    }

    res.status(200).json({ message: 'Data uploaded and saved to the database successfully. Duplicate or invalid records were skipped.' });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file: ' + error.message });
  }
});

module.exports = router;
