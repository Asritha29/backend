const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience');

router.get('/employe/:empId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ empId: req.params.empId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const kyc = await Kyc.findOne({ empId: req.params.empId }) || null;
    const education = await Education.findOne({ empId: req.params.empId }) || null;
    const experience = await Experience.findOne({ empId: req.params.empId }) || null;
    
    const combinedData = {
        ...employee.toObject(),
        ...(kyc ? kyc.toObject() : {}),
        ...(education ? education.toObject() : {}),
        ...(experience ? experience.toObject() : {})
    };
    
    res.status(200).json({ status: 'success', data: combinedData });
  } catch (error) {
    console.error(`Error fetching employee data: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
  }
});

module.exports = router;
