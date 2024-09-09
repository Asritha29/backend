const mongoose = require('mongoose');

const exprienceSchema = new mongoose.Schema({
    experience:[{
        type: String,
       
     }],
     work:{
       type: String,
       
     },
     from:[{
       type: String,
       
     }],
     to:[{
       type: String,
       
     }],
     experiencedoc:{
       type:String,

     },
     empId:{
        type:String,
     }
});

const Expirence = mongoose.model('Expirence' , exprienceSchema);
module.exports = Expirence;