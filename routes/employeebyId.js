const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');
const Kyc = require('../model/kyc');
const Education = require('../model/educations'); 
const Experience = require('../model/experience'); 

router.get('/employee/:empId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ empId: req.params.empId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const kyc = await Kyc.findOne({ empId: req.params.empId }) || null;
    const education = await Education.findOne({ empId: req.params.empId }) || null;
    const experience = await Experience.findOne({ empId: req.params.empId }) || null;

    res.status(200).json({ employee, kyc, education, experience });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
