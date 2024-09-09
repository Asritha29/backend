const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 


// router.post('/login', async (req, res) => {
//     try {
//         const { empID, password } = req.body;
//         const user = await User.findOne({ empID });


//         if (!user) {
//             return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
//         }

//         // Verify the password
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             {
//                 _id: user._id,
//                 empId: user.empId,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET, 
//             { expiresIn: '1h' }
//         );

//         return res.json({ status: 'ok', token });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'error', error: 'Internal server error' });
//     }
// });

router.post('/login', async (req, res) => {
    const { empId, password } = req.body;
  
    try {
      const user = await User.findOne({ empId });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          return res.status(400).json({ status: 'error', error: 'Invalid credentials' });
      }

  
      // Generate a unique JWT token for the user
      const token = jwt.sign(
        { _id: user._id, empId: user.empId, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;


  