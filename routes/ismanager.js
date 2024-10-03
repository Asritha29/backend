// routes/ismanager.js
const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');

router.get('/ismanager', async (req, res) => {
  try {
    const managers = await Employee.find({ ismanager: true });
    if (!managers || managers.length === 0) {
      return res.status(404).json({ message: 'No managers found' });
    }
    res.status(200).json(managers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
