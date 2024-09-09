const express = require('express');
const router = express.Router();
const District = require('../model/district');

router.get('/:state', async (req, res) => {
    try {
        const districts = await District.find({ state: req.params.state }).distinct('district');
        res.status(200).json(districts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;