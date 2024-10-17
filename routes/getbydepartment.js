const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');

// Route to get employees by team/department
router.get('/department', async (req, res) => {
  try {
    const { team } = req.query;  // Use req.query for query parameters

    if (!team) {
      return res.status(400).json({ message: 'Team/Department is required' });
    }

    // Fetch employees based on the team/department
    const employees = await Employee.find({ team });

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: `No employees found in the ${team} department` });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
