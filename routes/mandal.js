const express = require('express');
const router = express.Router();
const District = require('../model/district');

router.get('/:district', async (req, res) => {
    try {
        const mandals = await District.find({ district: req.params.district }).distinct('mandal');
        res.status(200).json(mandals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
