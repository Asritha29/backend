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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
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

const getFilePath = (file) => (file && file.length > 0 ? `${BASE_URL}${file[0].filename}` : null);

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
      // Prepare the updated employee data
      const updatedData = {
        fullName: req.body.fullName,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        dob: req.body.dob,
        gender: req.body.gender,
        maritalStatus: req.body.maritalStatus,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
        permanentAddress: req.body.permanentAddress,
        emgContact: req.body.emgContact,
        emgRelation: req.body.emgRelation,
        emgNumber: req.body.emgNumber,
        empId: req.body.empId,
        doj: req.body.doj,
        type: req.body.type,
        team: req.body.team,
        status: req.body.status,
        exitformalities: req.body.exitformalities,
        managerName: req.body.managerName,
        designation: req.body.designation,
        ismanager: req.body.ismanager,
        country: req.body.country,
        state: req.body.state,
        district: req.body.district,
        mandal: req.body.mandal,
        village: req.body.village,
        nameapb: req.body.nameapb,
        lpa: req.body.lpa,
        salary: req.body.salary,
        netsalary: req.body.netsalary,
        petrolAllow: req.body.petrolAllow,
        incentives: req.body.incentives,
        Arrears: req.body.Arrears,
        spcialAllowances: req.body.spcialAllowances,
        basic: req.body.basic,
        hra: req.body.hra,
        ca: req.body.ca,
        other: req.body.other,
        allowance: req.body.allowance,
        pf: req.body.pf,
        pt: req.body.pt,
        esi: req.body.esi,
        esinumber: req.body.esinumber,
        generatedeis: req.body.generatedeis,
        tds: req.body.tds,
        insurance: req.body.insurance,
        loan: req.body.loan,
        bankName: req.body.bankName,
        accNo: req.body.accNo,
        uanNumber: req.body.uanNumber,
        ifscaNumber: req.body.ifscaNumber,
        contractStart: req.body.contractStart,
        contractEnd: req.body.contractEnd,
        esiFixedAmount: req.body.esiFixedAmount,
        esiType: req.body.esiType,
        pfFixedAmount: req.body.pfFixedAmount,
        experience: req.body.experience,
        pfType: req.body.pfType,
        clientId:req.body.clientId,
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

      // Update education details
      const educationDetails = Array.isArray(req.body.educationDetails) ? req.body.educationDetails : [];
      if (educationDetails.length > 0) {
        const educationData = educationDetails.map((detail, index) => ({
          course: req.body.course && req.body.course[index] ? req.body.course[index] : '',
          courseType: req.body.courseType && req.body.courseType[index] ? req.body.courseType[index] : '',
          institution: req.body.institution && req.body.institution[index] ? req.body.institution[index] : '',
          fromDate: detail.fromDate ? new Date(detail.fromDate) : null,
          toDate: detail.toDate ? new Date(detail.toDate) : null,
          educationdoc: getFilePath(req.files['educationdoc']),
        }));

        await Education.findOneAndUpdate(
          { empId },
          { $set: { educationDetails: educationData } },
          { new: true }
        );
      }

      // Update experience details
      await Experience.findOneAndUpdate(
        { empId },
        {
          experience: req.body.experience,
          work: req.body.work,
          from: req.body.from,
          to: req.body.to,
          experiencedoc: getFilePath(req.files['experiencedoc']),
        },
        { new: true }
      );

      res.status(200).json({
        employee: updatedEmployee,
        kyc: updatedKyc,
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ message: 'Failed to update employee.', error: error.message });
    }
  });
});

module.exports = router;
