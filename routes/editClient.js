const express = require('express');
const Client = require('../model/client');
const router = express.Router();

router.get('/editClient/:clientName', async (req, res) => {
  const { clientName } = req.params;
  try {
    const existingRecord = await Client.findOne({ clientName });

    if (!existingRecord) {
      console.log(`GET: ${clientName} does not exist.`);
      return res.status(404).json({ status: 'error', message: 'Client does not exist.' });
    }

    return res.status(200).json({ status: 'success', data: existingRecord });
  } catch (error) {
    console.error(`Error fetching Client record: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
  }
});

router.put('/editClient/:clientName', async (req, res) => {
  const { clientName } = req.params;

  const {  
    contName, 
    conNumber, 
    clientEmail, 
    address, 
    ismainClient, 
    mainClient, 
    gstNumber, 
    status, 
    contractStart,
    contractEnd,
  } = req.body;

  const clientUpdates = {
    contName, 
    conNumber, 
    clientEmail, 
    address, 
    ismainClient, 
    mainClient, 
    gstNumber, 
    status, 
    contractStart,
    contractEnd,
  };

  try {
    const updatedClient = await Client.findOneAndUpdate(
      { clientName },
      { $set: clientUpdates },
      { new: true }
    );

    if (!updatedClient) {
      console.log(`PUT: ${clientName} does not exist.`);
      return res.status(404).json({ status: 'error', message: 'Client does not exist.' });
    }

    return res.status(200).json({ status: 'success', data: updatedClient });
  } catch (error) {
    console.error(`Error updating Client record: ${error.message}`);
    return res.status(500).json({ status: 'error', message: 'Server Error', error: error.message });
  }
});

module.exports = router;
