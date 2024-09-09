const express = require('express');
const router = express.Router();
const District = require('../model/district');

router.get('/:mandal', async (req, res) => {
    try {
        const villages = await District.find({ mandal: req.params.mandal }).distinct('village');
        res.status(200).json(villages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
