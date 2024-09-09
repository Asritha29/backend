// routes/ismanager.js
const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');

// Route to get the list of all employees who are managers
router.get('/ismanager', async (req, res) => {
  try {
    // Fetch employees where 'ismanager' is true
    const managers = await Employee.find({ ismanager: true });

    // If no managers found, 404 response
    if (!managers || managers.length === 0) {
      return res.status(404).json({ message: 'No managers found' });
    }

    // Respond with the list of manager employees
    res.status(200).json(managers);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
