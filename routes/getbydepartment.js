const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience'); 


router.get('/department', async (req, res) => {
  try {
    const clients = await Employee.find({ team});
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'No clients found' });
    }

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;