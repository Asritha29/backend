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

})
const Attendance = mongoose.model('Attendance', attendanceSechema);

module.exports = Attendance