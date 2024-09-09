const express = require('express');
const router = express.Router();
const Client = require('../model/client');

router.get('/client', async (req, res) => {
    try {
        const clientData = await Client.find();
        res.status(200).json(clientData); 
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message }); 
    }
});

module.exports = router;