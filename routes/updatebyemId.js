const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const Employee = require('../model/employee');
const User = require('../model/user');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience');
const { celebrate, Joi, Segments } = require('celebrate'); // For validation
const BASE_URL = process.env.BASE_URL;

// Utility to ensure upload directory exists
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    ensureDirExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /(pdf|png|jpeg|jpg)/;
    if (!file.mimetype.match(allowedTypes)) {
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

router.put(
  '/update/:empId',
  celebrate({
    [Segments.PARAMS]: Joi.object({
      empId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object({
      fullName: Joi.string().optional(),
      // Add other validations as needed
    }),
  }),
  async (req, res) => {
    const { empId } = req.params;

    upload(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).json({ message: 'File upload failed.', error: err.message });
      }

      if (!req.files) {
        return res.status(400).json({ message: 'No files uploaded.' });
      }

      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        console.log(`Starting update process for empId: ${empId}`);

        const existingEmployee = await Employee.findOne({ empId }).session(session);
        if (!existingEmployee) {
          console.warn(`Employee with empId ${empId} not found.`);
          throw new Error('Employee not found.');
        }

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
          esiFixedAmount:req.body.esiFixedAmount,
          esiType:req.body.esiType,
          pfFixedeamount:body.pfFixedeamount,
          pfType:body.pfType,
          empImg: getFilePath(req.files['empImg']),
          aadhaarPanUp: getFilePath(req.files['aadhaarPanUp']),
        };

        const updatedEmployee = await Employee.findOneAndUpdate({ empId }, updatedData, { new: true, session });
        if (req.body.empId !== empId) {
          await User.findOneAndUpdate(
            { empId },
            {
              empId: req.body.empId,
              phoneNumber: req.body.phoneNumber,
              eId: updatedEmployee._id,
            },
            { new: true, session }
          );
        }
  
        // Update KYC
        const updatedKyc = await Kyc.findOneAndUpdate(
          { empId },
          {
            empId: req.body.empId,
            aadharno: Array.isArray(req.body.aadharno) ? req.body.aadharno : [req.body.aadharno],
            familyName: Array.isArray(req.body.familyName) ? req.body.familyName : [req.body.familyName],
            famrelation: Array.isArray(req.body.famrelation) ? req.body.famrelation : [req.body.famrelation],
            aadharkyc: getFilePath(req.files['aadhaarkyc']),
          },
          { new: true, session }
        );
  
        // Update Education
        const educationDetails = Array.isArray(req.body.educationDetails) ? req.body.educationDetails : [];
        if (educationDetails.length > 0) {
          const educationData = educationDetails.map((detail, index) => ({
            course: req.body.course[index] || '',
            courseType: req.body.courseType[index] || '',
            institution: req.body.institution[index] || '',
            fromDate: detail.fromDate ? new Date(detail.fromDate) : null,
            toDate: detail.toDate ? new Date(detail.toDate) : null,
            educationdoc: getFilePath(req.files['educationdoc']),
          }));
  
          await Education.findOneAndUpdate(
            { empId },
            { $set: { educationDetails: educationData } },
            { new: true, session }
          );
        }
  
        // Update Experience
        await Experience.findOneAndUpdate(
          { empId },
          {
            experience: req.body.experience,
            work: req.body.work,
            from: req.body.from,
            to: req.body.to,
            experiencedoc: getFilePath(req.files['experiencedoc']),
          },
          { new: true, session }
        );
  
        await session.commitTransaction();
        session.endSession();
  
        res.status(200).json({
          employee: updatedEmployee,
          kyc: updatedKyc,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
  
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Failed to update employee.', error: error.message });
      }
    });
  });

module.exports = router;
