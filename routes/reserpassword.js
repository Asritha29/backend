const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
router.post('/reset-password', async (req, res) => {
    const { phoneNumber, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

    //   const salt = await bcrypt.genSalt(10);
    //   const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = newPassword;
      user.isFirstLogin = false;
  
      await user.save();
  
      res.json({ message: 'Password reset successful, you can now log in with your new password.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
