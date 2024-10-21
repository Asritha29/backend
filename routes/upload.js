const express = require('express');
const router = express.Router();
const multer = require('multer');
const readXlsxFile = require('read-excel-file/node');
const Employee = require('../model/employee');
const User = require('../model/user');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience');

const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const XLSX_EXTENSION = '.xlsx';

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
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

    const employeePromises = data.map(async (employeeData) => {
      try {
        const { empId, phoneNumber } = employeeData;

        let user = await User.findOne({ empId });
        if (!user) {
          user = new User({
            phoneNumber,
            empId,
            password: 'globusit', 
          });
          await user.save();
        }

        let employee = await Employee.findOne({ empId });
        if (!employee) {
          employee = new Employee({
            ...employeeData,
            user: user._id, 
          });
          await employee.save();
          await new Kyc({ ...employeeData, employee: employee._id }).save();
          await new Experience({ ...employeeData, employee: employee._id }).save();
          await new Education({ ...employeeData, employee: employee._id }).save();
        } else {
          console.warn('Employee already exists:', empId);
        }

        return { success: true, empId };
      } catch (error) {
        console.error('Error processing employee:', error);
        return { success: false, empId: employeeData.empId, error: error.message };
      }
    });

    const results = await Promise.allSettled(employeePromises);

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
