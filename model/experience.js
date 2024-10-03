const mongoose = require('mongoose');

const exprienceSchema = new mongoose.Schema({
    experience:[{
        type: String,
        trim: true,
        required:false
     }],
     work:{
       type: String,
       required:false,
       trim: true
     },
     from:[{
       type: String,
       trim: true,
       required:false
     }],
     to:[{
       type: String,
       trim: true,
       required:false
     }],
     experiencedoc:{
       type:String,      
     },
     empId:{
        type:String,
     },
     employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee', 
      // required: true 
      },
});

const Expirence = mongoose.model('Expirence' , exprienceSchema);
module.exports = Expirence;