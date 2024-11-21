const express = require('express');
const router = express.Router();
const Employee = require('../model/employee');
const Kyc = require('../model/kyc');
const Education = require('../model/educations');
const Experience = require('../model/experience');
const Client = require('../model/client');

router.get('/main', async (req, res) => {
  try {
    const { mainClientName } = req.query; 
    if (!mainClientName) {
      return res.status(400).json({ message: 'Main client name is required' });
    }


    const mainClient = await Client.findOne({ clientName: mainClientName, isMainClient: true }).lean();
    
    if (!mainClient) {
      return res.status(404).json({ message: 'Main client not found or not marked as a main client' });
    }
    const relatedClients = await Client.find({ mainClientId: mainClient._id }).lean();
    const clientNames = [mainClient.clientName, ...relatedClients.map(client => client.clientName)];
    const employees = await Employee.find({ organization: { $in: clientNames } }).lean();
    
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found for the client(s)' });
    }

    const employeeData = await Promise.all(employees.map(async (employee) => {
      const [kyc, education, experience] = await Promise.all([
        Kyc.findOne({ empId: employee.empId }).lean(),
        Education.findOne({ empId: employee.empId }).lean(),
        Experience.findOne({ empId: employee.empId }).lean()
      ]);
      return { employee, kyc, education, experience };
    }));

    res.status(200).json(employeeData);
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
