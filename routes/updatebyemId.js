const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Employee = require('../model/employee');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience');
const { Email } = require('read-excel-file');
const BASE_URL = process.env.BASE_URL;

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

// Multer setup
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

const getFilePath = (file) => (file ? `${BASE_URL}${file[0].filename}` : null);

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
      const updatedData = {
        fullName: req.body.fullName,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        dob:req.body.motherName,
        gender:req.body.gender,
        maritalStatus:req.body.maritalStatus,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        address:req.body.address,
        permenentadrs:req.body.permenentadrs,
        emgContact:req.body.emgContact,
        emgRelation:req.body.emgRelation,
        emgNumber:req.body.emgNumber,
        empId:req.body.empId,
        doj:req.body.doj,
        type:req.body.type,
        team:req.body.team,
        status:req.body.status,
        exitformalities:req.body.exitformalities,
        managerName:req.body.managerName,
        designation:req.body.designation,
        ismanager:req.body.ismanager,
        country:req.body.country,
        state:req.body.state,
        district:req.body.district,
        mandal:req.body.mandal,
        village:req.body.village,
        nameapb:req.body.nameapb,
        lpa:req.body.lpa,
        salary:req.body.salary,
        netsalary: req.body.netsalary,
        petrolAllow:req.body.petrolAllow,
        incentives:req.body.incentives,
        Arrears:req.body.Arrears,
        spcialAllowances:req.body.spcialAllowances,
        basic:req.body.basic,
        hra:req.body.hra,
        ca:req.body.ca,
        other:req.body.other,
        allowance:req.body.allowance, 
        pf:req.body.pf,
        pt:req.body.pt,
        esi:req.body.esi,
        esinumber:req.body.esinumber,
        genratedeis:req.body.genratedeis,
        tds:req.body.tds,
        insurance:req.body.insurance,
        loan:req.body.lone,
        bankName:req.body.bankName,
        accNo:req.body.accNo,
        uanNumber:req.body.uanNumber,
        ifscaNumber:req.body.ifscaNumber,
        contractStart:req.body.contractStart,
        contractEnd:req.body.contractEnd,
        empImg: getFilePath(req.files['empImg']),
        aadhaarPanUp: getFilePath(req.files['aadhaarPanUp']),
      };

      const updatedEmployee = await Employee.findOneAndUpdate({ empId }, updatedData, { new: true });

      const updatedKyc = await Kyc.findOneAndUpdate(
        { empId },
        {
          aadharno: Array.isArray(req.body.aadharno) ? req.body.aadharno : [req.body.aadharno],
          familyName: Array.isArray(req.body.familyName) ? req.body.familyName : [req.body.familyName],
          famrelation: Array.isArray(req.body.famrelation) ? req.body.famrelation : [req.body.famrelation],
          aadharkyc: getFilePath(req.files['aadhaarkyc']),
        },
        { new: true }
      );

      const updatedEducation = await Education.findOneAndUpdate(
        { empId },
        {
          course: Array.isArray(req.body.course) ? req.body.course : [req.body.course],
          // ... other fields
          educationdoc: getFilePath(req.files['educationdoc']),
        },
        { new: true }
      );

      const updatedExperience = await Experience.findOneAndUpdate(
        { empId },
        {
          experience: Array.isArray(req.body.experience) ? req.body.experience : [req.body.experience],
          // ... other fields
          experiencedoc: getFilePath(req.files['experiencedoc']),
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
      res.status(500).json({ message: 'Failed to update employee.', error: error.message });
    }
  });
});

module.exports = router;
