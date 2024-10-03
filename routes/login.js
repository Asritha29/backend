const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) {
      return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
    }

    if (user.isFirstLogin) {
      return res.status(200).json({
        message: 'First login detected, please reset your password.',
        firstLogin: true, 
        token: null
      });
    }

    const token = jwt.sign(
      {
        phoneNumber: user.phoneNumber, 
        empId: user.empId,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ status: 'ok', token, firstLogin: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
