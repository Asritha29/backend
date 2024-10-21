const express = require('express');
const Attendance = require('../model/attendance');
const router = express.Router();

router.get('/attendance', async (req, res) => {
  const { year, month } = req.query;
  try {
    const attendanceRecords = await Attendance.find({ year, month });
    if (!attendanceRecords.length) {
      console.log(`No attendance records for ${month}/${year}.`);
      return res.status(400).json({ status: 'error', message: 'No attendance records found for this month' });
    }
    return res.status(200).json(attendanceRecords);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
