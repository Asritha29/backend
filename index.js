// Required dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
// const fileupload = require('express-fileupload');
const multer = require('multer');
const path = require('path');
// const port = 5006;

// Route imports
const connectDB = require('./model/config/db');
const employeeupload = require('./routes/upload');
const employeeRoutes = require('./routes/create');
const employeeget = require('./routes/employees');
const auth = require('./middleware/authentication');
const login = require('./routes/login');
const attendance = require('./routes/attendance');
const employeebyId = require('./routes/employeebyId');
const payslip = require('./routes/payslips');
const logout = require('./routes/logout');
const country = require('./routes/countrys');
const state = require('./routes/states');
const districts = require('./routes/district');
const mandals = require('./routes/mandal');
const villages = require('./routes/village');
const ismanager = require('./routes/ismanager');
const client = require('./routes/client');
const ismainClient = require('./routes/ismainClient');
const getclient = require('./routes/getClient');

// import { SpeedInsights } from "@vercel/speed-insights/next"
// Initialize Express app
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());


app.use(express.urlencoded({ extended: true }));

// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Static file serving
app.use("/files", express.static("files"));

// Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// Application Routes
app.use('/user', login);
app.use('/logout', logout);
app.use('/admin', country);
app.use('/states', state);
app.use('/districts', districts);
app.use('/mandals', mandals);
app.use('/villages', villages);
// app.use('/admin', aadhaar);


// Protected Routes
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), employeebyId);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), ismanager);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), ismainClient);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), getclient);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), employeeget);
app.use('/user' , auth, authorizeRoles('Admin', 'Hr', 'User'), payslip);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), client);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), employeeupload);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), employeeRoutes);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), attendance);
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Connect to MongoDB
connectDB();

// Start server
const port = process.env.PORT || 5006;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
//   });