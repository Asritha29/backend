const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');
const Attendance = require('../model/attendance');

router.get('/payslip/:empId', async (req, res) => {
    const { empId } = req.params;
    const { year, month } = req.query;  

    try {
        const existingRecord = await Attendance.findOne({ empId, year, month });
        if (!existingRecord) {
            console.log(`Attendance for Employee ID ${empId} for ${month}/${year} does not exist.`);
            return res.status(400).json({ status: 'error', message: 'Pay slip for this month does not exist' });
        }

        const employeeData = await Employee.findOne({ empId });
        if (!employeeData) {
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const combinedData = {
            ...employeeData.toObject(),
            ...existingRecord.toObject(),
        };

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
