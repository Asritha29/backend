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
const resetPassword = require('./routes/reserpassword');
const department = require('./routes/getbydepartment');
const clientUpload = require('./routes/clientupload');
const updateEmployee = require('./routes/updatebyemId');
const getattendance = require('./routes/getattendace');
const attendancebyempId = require('./routes/editAttendance');
const updateAttendance = require('./routes/editAttendance');
const getEmpbyId = require('./routes/getemployeid');
const getclientbyname = require('./routes/editClient');
const updateclient = require('./routes/editClient');
const employeebyclient = require('./routes/employeebymainclient');
const editEmployee = require('./routes/updatdeemployeebyExcel');

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Static file serving
app.use("/files", express.static("files"));

// Authorization Middleware
// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
//     }
//     next();
//   };
// };
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

app.use('/user', resetPassword);
app.use('/user', login);
app.use('/logout', logout);
app.use('/admin', country);
app.use('/states', state);
app.use('/districts', districts);
app.use('/mandals', mandals);
app.use('/villages', villages);
// app.use('/admin', employeeRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Protected Routes
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), employeebyId);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), getEmpbyId);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), ismanager);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), ismainClient);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), getclient);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), employeeget);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), department);
app.use('/user' , auth, authorizeRoles('Admin', 'Hr', 'User'), payslip);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), client);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr', 'User'), clientUpload);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), employeeupload);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), employeeRoutes);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), updateEmployee);
app.use('/hr', auth, authorizeRoles('Admin', 'Hr' ) , editEmployee);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), attendance);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), getattendance);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), attendancebyempId);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), updateAttendance);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), getclientbyname);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), updateclient);
app.use('/admin', auth, authorizeRoles('Admin', 'Hr'), employeebyclient);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});


connectDB();

const port = process.env.PORT || 5006;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
//   });