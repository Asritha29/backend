const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    // fullName: String,
    // esi: String,
    // genratedeis: String,
    aadharno:[{ 
        type:String,
        required: false,
        trim: true
    }],
    famrelation:[{
        type: String,
        required: false,
        trim: true
    }],   
    familyName:[{
        type:String,
        required: false,
        trim: true
    }],
    aadharkyc:{
        type:String
    },
    empId:{
        type:String
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        // required: true 
    },
    
});


const Kyc = mongoose.model('Kyc', kycSchema);

module.exports = Kyc