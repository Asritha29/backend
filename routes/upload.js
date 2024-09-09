const express = require('express');
const router = express.Router();
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const Employee = require('../model/employee');
const User = require('../model/user');

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || !req.file.originalname.endsWith('.xlsx')) {
        return res.status(400).json({ error: 'Invalid file type. Please upload an Excel (.xlsx) file.' });
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
  
      const employeePromises = data.map(async (employeeData) => {
        try {
          let user = await User.findOne({ empId: employeeData.empId });
  
          if (!user) {
            user = new User({
              phoneNumber: employeeData.phoneNumber,
              empId: employeeData.empId,
              password: 'globusit',
            });
            await user.save();
          }
  
          let employee = await Employee.findOne({ empId: employeeData.empId });
  
          if (!employee) {
            employee = new Employee({
              ...employeeData,
              user: user._id,
            });
            await employee.save();
          } else {
            console.warn('Employee already exists:', employeeData.empId);
          }
  
          return employee;
        } catch (error) {
          console.error('Error processing employee:', error);
          throw error;
        }
      });
  
      await Promise.all(employeePromises);
  
      res.status(200).json({ message: 'Data uploaded and saved to database successfully' });
    } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).json({ error: 'Error processing file: ' + error.message });
    }
  });  

module.exports = router;
