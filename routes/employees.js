const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');

router.get('/employee', async (req, res) => {
    try {
        const employeeData = await Employee.find();
        res.status(200).json(employeeData); 
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message }); 
    }
});

module.exports = router;
