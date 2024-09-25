const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Employee = require('../model/employee');
const User = require('../model/user');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience'); 
const BASE_URL = process.env.BASE_URL ;

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

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

const getFilePath = (file) => (file ? `${BASE_URL}${file[0].filename}` : null);

router.post('/create', (req, res) => {
  console.log('Incoming Request:', req.headers);

  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: 'File upload failed.', error: err.message });
    }

    if (!req.files) {
      console.error('No files uploaded.');
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    console.log('Uploaded Files:', req.files);

    try {
      console.log('Request Body:', req.body);

      const {
        fullName, fatherName, motherName, dob, gender, maritalStatus, phoneNumber, email, empId,
        address, permenentadrs, emgContact, emgRelation, emgNumber, doj, type, team, status, exitformalities,
        managerName, designation, ismanager, country, state, district, mandal, village, nameapb, lpa, salary, netsalary,
        petrolAllow, basic, hra, ca, other, allowance, pf, pt, esi, esinumber, genratedeis, tds, insurance, incentives,
        spcialAllowances, Arrears, loan, bankName, accNo, uanNumber, ifscNumber, course, courseType, institution, formdata,
        toDate, experience, from, to, contractStart, contractEnd, aadharno, famrelation, familyName
      } = req.body;

      // Get file paths
      const aadhaarkycFilePath = getFilePath(req.files['aadhaarkyc']);
      const educationDocFilePath = getFilePath(req.files['educationdoc']);
      const experienceDocFilePath = getFilePath(req.files['experiencedoc']);
      const empImgFilePath = getFilePath(req.files['empImg']);
      const aadhaarPanUpFilePath = getFilePath(req.files['aadhaarPanUp']);

      const newEmployee = new Employee({
        fullName, fatherName, motherName, dob, gender, maritalStatus, phoneNumber, email, empImg: empImgFilePath, 
        address, permenentadrs, emgContact, emgRelation, emgNumber, empId, doj, type, team, status, exitformalities,
        managerName, designation, ismanager, country, state, district, mandal, village, nameapb, lpa, salary, netsalary,
        petrolAllow, incentives, Arrears, spcialAllowances, basic, hra, ca, other, allowance, pf, pt, esi, esinumber, 
        genratedeis, tds, insurance, loan, bankName, accNo, uanNumber, ifscNumber, contractStart, contractEnd,
        aadhaarPanUp: aadhaarPanUpFilePath
      });

      const savedEmployee = await newEmployee.save();

      const newKyc = new Kyc({
        aadharno: Array.isArray(aadharno) ? aadharno : [aadharno],
        familyName: Array.isArray(familyName) ? familyName : [familyName],
        famrelation: Array.isArray(famrelation) ? famrelation : [famrelation],
        aadharkyc: aadhaarkycFilePath,
        empId
      });

      const savedKyc = await newKyc.save();

      const newEducation = new Education({
        course: Array.isArray(course) ? course : [course],
        courseType: Array.isArray(courseType) ? courseType : [courseType], 
        institution: Array.isArray(institution) ? institution : [institution],
        formdata: Array.isArray(formdata) ? formdata : [formdata],
        toDate: Array.isArray(toDate) ? toDate : [toDate],
        educationdoc: educationDocFilePath,
        empId,
      });

      const savedEducation = await newEducation.save();

      const newExperience = new Experience({ 
        experience: Array.isArray(experience) ? experience : [experience], 
        from: Array.isArray(from) ? from : [from],
        to: Array.isArray(to) ? to : [to],
        experiencedoc: experienceDocFilePath,
        empId,
      });

      const savedExperience = await newExperience.save(); 

      const newUser = new User({
        phoneNumber,
        password: 'globusit', // Default password
        empId,
        eId: savedEmployee._id,
      });

      const savedUser = await newUser.save();

      res.status(201).json({
        message: 'Employee created successfully',
        employee: savedEmployee,
        user: savedUser,
        kyc: savedKyc,
        education: savedEducation,
        experience: savedExperience
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ message: 'Failed to create employee.', error: error.message });
    }
  });
});

module.exports = router;
