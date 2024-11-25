const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const Employee = require('../model/employee');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience');
const User = require('../model/user');
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

router.put('/update/:empId', async (req, res) => {
  const session = await mongoose.startSession(); // Start the session
  session.startTransaction(); // Start the transaction
  let transactionCommitted = false; // Flag to track transaction status

  try {
    const { empId } = req.params;
    // console.log('empId:', empId);

    // Check if the employee exists
    const employeeExists = await Employee.findOne({ empId });
    if (!employeeExists) {
      throw new Error('Employee not found.');
    }
    // console.log('Employee found:', employeeExists);

    // File upload logic
    upload(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        throw new Error('File upload failed.');
      }

      if (!req.files) {
        throw new Error('No files uploaded.');
      }

      // Prepare updated data
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
        permenentadrs: req.body.permenentadrs,
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
        genratedeis: req.body.genratedeis,
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
        pfFixedeamount: req.body.pfFixedeamount,
        pfType: req.body.pfType,
        empImg: getFilePath(req.files['empImg']),
        aadhaarPanUp: getFilePath(req.files['aadhaarPanUp']),
      };

      // Update Employee document
      const updatedEmployee = await Employee.findOneAndUpdate({ empId }, updatedData, { new: true, session });

      // Update User, Kyc, Education, and Experience documents similarly
      const updatedUser = await User.findOneAndUpdate(
        { empId },
        {
          empId: req.body.empId,
          phoneNumber: req.body.phoneNumber,
        },
        { new: true, session }
      );

      const updatedKyc = await Kyc.findOneAndUpdate(
        { empId },
        {
          empId: req.body.empId,
          aadharno: Array.isArray(req.body.aadharno) ? req.body.aadharno : [req.body.aadharno],
          aadharkyc: getFilePath(req.files['aadhaarkyc']),
        },
        { new: true, session }
      );

      // Commit the transaction after successful updates
      await session.commitTransaction();
      transactionCommitted = true; // Mark transaction as committed
      session.endSession();

      // Respond with success
      res.status(200).json({
        employee: updatedEmployee,
        user: updatedUser,
        kyc: updatedKyc,
      });
    });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction(); // Abort the transaction if not committed
    }
    session.endSession(); // Ensure session is always closed
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Failed to update employee.', error: error.message });
  }
});


module.exports = router;