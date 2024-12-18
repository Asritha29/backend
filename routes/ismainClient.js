const express = require('express');
const router = express.Router();
const Client = require('../model/client');

router.get('/ismainClient', async (req, res) => {
  try {
    const clients = await Client.find({ ismainClient: true });
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'No clients found' });
    }

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;