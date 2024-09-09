const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/user'); 
const { authenticateJWT, authorizeRoles } = require('../middleware/auth'); 

// User registration
router.post('/register', async (req, res) => {
    const { email, empId, role, fullname, password, phoneNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ email, empId, role, fullname, password: hashedPassword, phoneNumber });

    try {
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Protected route example
router.get('/admin', authenticateJWT, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome, admin!' });
});

module.exports = router;
