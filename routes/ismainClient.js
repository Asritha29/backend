// routes/ismainClient.js
const express = require('express');
const router = express.Router();
const Client = require('../model/client');

// Route to get the list of all Clients who are clients
router.get('/ismainClient', async (req, res) => {
  try {
    // Fetch Clients where 'ismainClient' is true
    const clients = await Client.find({ ismainClient: true });

    // If no clients found, send a 404 response
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'No clients found' });
    }

    // Respond with the list of manager Clients
    res.status(200).json(clients);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;