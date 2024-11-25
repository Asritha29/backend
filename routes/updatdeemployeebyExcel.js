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

        if (!empId) {
          throw new Error('empId is missing in the uploaded data.');
        }

        let changesMade = false;

        // Find the existing user
        let user = await User.findOne({ empId });
        if (user) {
          if (user.phoneNumber !== phoneNumber) {
            await User.updateOne({ empId }, { $set: { phoneNumber } });
            changesMade = true;
          }
        } else {
          user = new User({
            phoneNumber,
            empId,
          });
          await user.save();
          changesMade = true;
        }

        // Find the existing employee
        let employee = await Employee.findOne({ empId });
        if (employee) {
          const updatedFields = {};
          Object.keys(employeeData).forEach((key) => {
            if (employee[key] !== employeeData[key]) {
              updatedFields[key] = employeeData[key];
              changesMade = true;
            }
          });

          if (changesMade && Object.keys(updatedFields).length > 0) {
            await Employee.updateOne({ empId }, { $set: updatedFields });
          }

          // Update related collections only if changes are required
          if (changesMade) {
            await Promise.all([
              Kyc.updateOne({ employee: employee._id }, { $set: { ...employeeData } }),
              Experience.updateOne({ employee: employee._id }, { $set: { ...employeeData } }),
              Education.updateOne({ employee: employee._id }, { $set: { ...employeeData } }),
            ]);
          }
        } else {
          // Create a new employee and related documents if not found
          employee = new Employee({
            ...employeeData,
            user: user._id,
          });
          await employee.save();

          await Promise.all([
            new Kyc({ ...employeeData, employee: employee._id }).save(),
            new Experience({ ...employeeData, employee: employee._id }).save(),
            new Education({ ...employeeData, employee: employee._id }).save(),
          ]);

          changesMade = true;
        }

        return { success: true, empId, changesMade };
      } catch (error) {
        console.error(`Error processing employee ${employeeData.empId}:`, error);
        return { success: false, empId: employeeData.empId, error: error.message };
      }
    });

    const results = await Promise.allSettled(employeePromises);

    // Summarize results
    const summary = {
      updated: [],
      skipped: [],
      errors: [],
    };

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { empId, changesMade } = result.value;
        if (changesMade) {
          summary.updated.push(empId);
        } else {
          summary.skipped.push(empId);
        }
      } else {
        summary.errors.push({
          empId: result.reason.empId,
          error: result.reason.error,
        });
      }
    });

    res.status(200).json({
      message: 'Data processed successfully.',
      summary,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file: ' + error.message });
  }
});

module.exports = router;
