const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');


router.get('/employee/:empId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ empId: req.params.empId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
