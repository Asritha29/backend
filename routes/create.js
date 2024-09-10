const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Employee = require('../model/employee');
const User = require('../model/user');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Expirence = require('../model/exprience');

// Helper function to ensure directory exists
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Use the original file name and add a timestamp to prevent duplicates
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
// Multer Upload Middleware for multiple files
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/(pdf|png|jpeg|jpg)/)) {
      return cb(new Error('Only PDF, PNG, and JPEG files are allowed!'), false);
    }
    cb(null, true);
  },
}).fields([
  { name: 'aadhaarkyc', maxCount: 1 },
  { name: 'educationdoc', maxCount: 1 },
  { name: 'experiencedoc', maxCount: 1 },
  { name: 'empImg', maxCount: 1 },
  { name: 'aadhaarPanUp', maxCount: 1 },
]);

// Create a new employee route
router.post('/create', (req, res) => {
  console.log('Incoming Request:', req.headers);

  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: 'File upload failed.', error: err.message });
    }

    // Ensure files are uploaded
    if (!req.files) {
      console.error('No files uploaded.');
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    console.log('Uploaded Files:', req.files);

    try {
      // Extract and log request body for debugging
      console.log('Request Body:', req.body);

      const {
        fullName, fatherName, motherName, dob, gender, maritalStatus, phoneNumber, email, empImg, aadhaar, pan,
        address, permenentadrs, emgContact, emgRelation, emgNumber, empId, doj, type, team, status, exitformalities,
        managerName, designation, ismanager, country, state, district, mandal, village, nameapb, lpa, salary, netsalary,
        petrolAllow, basic, hra, ca, other, allowance, pf, pt, esi, esinumber, genratedeis, tds, insurance, incentives,
        spcialAllowances, Arrears, loan, bankName, accNo, uanNumber, ifscNumber, course, courseType, institution, formdata,
        toDate, experience, from, to, contractStart, contractEnd, aadharno, famrelation, familyName, aadhaarkyc, educationdoc, experiencedoc,aadhaarPanUp
      } = req.body;

      // Get file paths
      const aadhaarkycFilePath = req.files['aadhaarkyc'] ? `http://localhost:5006/uploads/${req.files['aadhaarkyc'][0].filename}` 
  : null;

const educationDocFilePath = req.files['educationdoc'] ? `http://localhost:5006/uploads/${req.files['educationdoc'][0].filename}` 
  : null;

const experienceDocFilePath = req.files['experiencedoc'] ? `http://localhost:5006/uploads/${req.files['experiencedoc'][0].filename}` 
  : null;

const empImgFilePath = req.files['empImg'] ? `http://localhost:5006/uploads/${req.files['empImg'][0].filename}` 
  : null;

const aadhaarPanUpFilePath = req.files['aadhaarPanUp'] ? `http://localhost:5006/uploads/${req.files['aadhaarPanUp'][0].filename}` 
  : null;


      // Create new employee
      const newEmployee = new Employee({
        fullName, fatherName, motherName, dob, gender, maritalStatus, phoneNumber, email, empImg: empImgFilePath, aadhaar, pan,
        address, permenentadrs, emgContact, emgRelation, emgNumber, empId, doj, type, team, status, exitformalities,
        managerName, designation, ismanager, country, state, district, mandal, village, nameapb, lpa, salary, netsalary,
        petrolAllow, incentives, Arrears, spcialAllowances, basic, hra, ca, other, allowance, pf, pt, esi, esinumber, genratedeis,
        tds, insurance, loan, bankName, accNo, uanNumber, ifscNumber,contractStart, contractEnd, aadhaarPanUp:aadhaarPanUpFilePath
      });

      // Save employee in the database
      const savedEmployee = await newEmployee.save();

      // Create new KYC record
      const newKyc = new Kyc({
        aadharno: Array.isArray(aadharno) ? aadharno : [aadharno],
        familyName: Array.isArray(familyName) ? familyName : [familyName],
        famrelation: Array.isArray(famrelation) ? famrelation : [famrelation],
        aadharkyc: aadhaarkycFilePath,
        empId
      });

      const savedKyc = await newKyc.save();

      // create education details 
      const newEducation = new Education({
        course: Array.isArray(course) ? course : [course],
        courseType: Array.isArray(courseType) ? courseType : [courseType], 
        institution: Array.isArray(institution) ? institution : [institution],
        formdata: Array.isArray(formdata) ? formdata : [formdata],
        toDate: Array.isArray(toDate) ? toDate : [toDate],
        educationdoc: educationDocFilePath,
        empId,
      });

      const saveEducation = await newEducation.save();

      // create experience details

      const newExprience = new Expirence({
        experience: Array.isArray(experience) ? experience : [experience], 
        from: Array.isArray(from) ? from : [from],
        to: Array.isArray(to) ? to : [to],
        experiencedoc: experienceDocFilePath,
        empId,
      });

      const saveExprience = newExprience.save();

      // Create new user linked to the employee
      const newUser = new User({
        phoneNumber,
        password: 'globusit', // Default password
        empId,
        eId: savedEmployee._id,
      });

      // Save user in the database
      const savedUser = await newUser.save();

      res.status(201).json({ employee: savedEmployee, user: savedUser, kyc: savedKyc, education: saveEducation, exprience: saveExprience});
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ message: 'Failed to create employee.' });
    }
  });
});

module.exports = router;
