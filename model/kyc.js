const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    // fullName: String,
    // esi: String,
    // genratedeis: String,
    aadharno:[{ 
        type:String,
        required: false
    }],
    famrelation:[{
        type: String,
        required: false
    }],   
    familyName:[{
        type:String,
        required: false
    }],
    aadharkyc:{
        type:String
    },
    empId:{
        type:String
    },

    
});


const Kyc = mongoose.model('Kyc', kycSchema);

module.exports = Kyc