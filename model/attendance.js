const mongoose = require('mongoose');

const attendanceSechema= new mongoose.Schema({
    fullName1:{
        type:String,
        required:true
    },
    empId:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    presentdays: {
        type: Number,
        required: true,
    },
    absentdays: {
        type: Number,
        // required: true,
    },  
    year:{
        type:Number,
        default:Date.now()
    },
    incentives1:{
        type: String,
    },
    allowance1:{
        type: String,
    },
    Arrears1:{
        type: String,
    },
    spcialAllowances1:{
        type: String,
    },
    totalWorkingDays:{
        type: String,
        required:true,
    },
    

})
const Attendance = mongoose.model('Attendance', attendanceSechema);

module.exports = Attendance