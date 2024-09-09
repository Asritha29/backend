const express = require('express');
const router = express.Router();
const Country = require('../model/country');

router.get('/country', async (req, res) => {
    try {
        const countryData = await Country.find();
        res.status(200).json(countryData); 
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message }); 
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Country = require('../model/countrys');


// router.post('/create', async (req, res) => {
//     try {
//         const {village,
//             mandal,
//             district,
//             state,
//             country, } = req.body;

//         // Create new employee
//         const newCountry = new Country({ village,
//             mandal,
//             district,
//             state,
//             country, });
       
        
//         const savedCountry = await newCountry.save();

      

//         res.status(201).json({ country: savedCountry,});
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })


// module.exports = router;