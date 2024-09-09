const express = require('express');
const router = express.Router();
const State = require('../model/state');
const District = require('../model/district');

// router.get('/:country' , async (req,res)=>{
//     try {
//         const statesData = await State.find({ country_name: req.params.country_name });
//         res.status(200).json(statesData); 
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message }); 
//     }
// })
router.get('/:country', async (req, res) => {
    try {
        const statesData = await State.find({ country_name: req.params.country });
        res.status(200).json(statesData); 
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message }); 
    }
});

module.exports = router;
