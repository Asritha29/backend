const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Employee = require('../model/employee');
const User = require('../model/user');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/exprience');


function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

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

//multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, 
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
  


router.put('/update/:empId', (req, res) => {
  const { empId } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: 'File upload failed.', error: err.message });
    }

    if (!req.files) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

    try {
      const {
        fullName, fatherName, motherName, dob, gender, maritalStatus, phoneNumber, email, empImg, aadhaar, pan,
        address, permenentadrs, emgContact, emgRelation, emgNumber, doj, type, team, status, exitformalities,
        managerName, designation, ismanager, country, state, district, mandal, village, nameapb, lpa, salary, netsalary,
        petrolAllow, basic, hra, ca, other, allowance, pf, pt, esi, esinumber, genratedeis, tds, insurance, incentives,
        spcialAllowances, Arrears, loan, bankName, accNo, uanNumber, ifscNumber, course, courseType, institution, formdata,
        toDate, experience, from, to, contractStart, contractEnd, aadharno, famrelation, familyName
      } = req.body;

      // Get file paths
      const aadhaarkycFilePath = req.files['aadhaarkyc'] ? `http://globusit-env.eba-5wfvbmm7.ap-south-1.elasticbeanstalk.com/uploads/${req.files['aadhaarkyc'][0].filename}` : null;
      const educationDocFilePath = req.files['educationdoc'] ? `http://globusit-env.eba-5wfvbmm7.ap-south-1.elasticbeanstalk.com/uploads/${req.files['educationdoc'][0].filename}` : null;
      const experienceDocFilePath = req.files['experiencedoc'] ? `http://globusit-env.eba-5wfvbmm7.ap-south-1.elasticbeanstalk.com/uploads/${req.files['experiencedoc'][0].filename}` : null;
      const empImgFilePath = req.files['empImg'] ? `http://globusit-env.eba-5wfvbmm7.ap-south-1.elasticbeanstalk.com/uploads/${req.files['empImg'][0].filename}` : null;
      const aadhaarPanUpFilePath = req.files['aadhaarPanUp'] ? `http://globusit-env.eba-5wfvbmm7.ap-south-1.elasticbeanstalk.com/uploads/${req.files['aadhaarPanUp'][0].filename}` : null;

    
      const updatedEmployee = await Employee.findOneAndUpdate(
        { empId },
        {
          fullName, fatherName, motherName, dob, gender, maritalStatus, phoneNumber, email, empImg: empImgFilePath, aadhaar, pan,
          address, permenentadrs, emgContact, emgRelation, emgNumber, doj, type, team, status, exitformalities,
          managerName, designation, ismanager, country, state, district, mandal, village, nameapb, lpa, salary, netsalary,
          petrolAllow, incentives, Arrears, spcialAllowances, basic, hra, ca, other, allowance, pf, pt, esi, esinumber, genratedeis,
          tds, insurance, loan, bankName, accNo, uanNumber, ifscNumber, contractStart, contractEnd, aadhaarPanUp: aadhaarPanUpFilePath
        },
        { new: true }
      );

     
      const updatedKyc = await Kyc.findOneAndUpdate(
        { empId },
        {
          aadharno: Array.isArray(aadharno) ? aadharno : [aadharno],
          familyName: Array.isArray(familyName) ? familyName : [familyName],
          famrelation: Array.isArray(famrelation) ? famrelation : [famrelation],
          aadharkyc: aadhaarkycFilePath,
        },
        { new: true }
      );

 
      const updatedEducation = await Education.findOneAndUpdate(
        { empId },
        {
          course: Array.isArray(course) ? course : [course],
          courseType: Array.isArray(courseType) ? courseType : [courseType],
          institution: Array.isArray(institution) ? institution : [institution],
          formdata: Array.isArray(formdata) ? formdata : [formdata],
          toDate: Array.isArray(toDate) ? toDate : [toDate],
          educationdoc: educationDocFilePath,
        },
        { new: true }
      );

     
      const updatedExperience = await Experience.findOneAndUpdate(
        { empId },
        {
          experience: Array.isArray(experience) ? experience : [experience],
          from: Array.isArray(from) ? from : [from],
          to: Array.isArray(to) ? to : [to],
          experiencedoc: experienceDocFilePath,
        },
        { new: true }
      );

      res.status(200).json({
        employee: updatedEmployee,
        kyc: updatedKyc,
        education: updatedEducation,
        experience: updatedExperience,
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Failed to update employee.' });
    }
  });
});

module.exports = router;
