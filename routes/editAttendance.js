const express = require('express');
const Attendance = require('../model/attendance');
const router = express.Router();

router.get('/editAttendance/:empId', async (req, res) => {
  const { empId } = req.params;
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ status: 'error', message: 'Year and month are required.' });
  }

  try {
    const existingRecord = await Attendance.findOne({ empId, year, month });

    if (!existingRecord) {
      console.log(`Attendance for Employee ID ${empId} for ${month}/${year} does not exist.`);
      return res.status(404).json({ status: 'error', message: 'Attendance record for this month does not exist' });
    }

    return res.status(200).json({ status: 'success', data: existingRecord });
  } catch (error) {
    console.error(`Error fetching attendance record: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
  }
});

// Update attendance record by empId, year, and month
router.put('/editAttendance/:empId', async (req, res) => {
  const { empId } = req.params;
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ status: 'error', message: 'Year and month are required.' });
  }

  const { presentdays, absentdays, totalWorkingDays, incentives1, specialAllowances1, Arrears1, allowance1 } = req.body;

  if (presentdays < 0 || absentdays < 0 || totalWorkingDays < 0) {
    return res.status(400).json({ status: 'error', message: 'Days values cannot be negative.' });
  }

  const attendanceUpdates = {
    presentdays,
    absentdays,
    totalWorkingDays,
    incentives1,
    allowance1,
    specialAllowances1,
    Arrears1,
  };

  try {
    const updatedAttendance = await Attendance.findOneAndUpdate(
      { empId, year, month },
      { $set: attendanceUpdates },
      { new: true }
    );

    if (!updatedAttendance) {
      console.log(`Attendance for Employee ID ${empId} for ${month}/${year} does not exist.`);
      return res.status(404).json({ status: 'error', message: 'Attendance record for this month does not exist' });
    }

    return res.status(200).json({ status: 'success', data: updatedAttendance });
  } catch (error) {
    console.error(`Error updating attendance record: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
  }
});

module.exports = router;
