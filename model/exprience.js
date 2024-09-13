const mongoose = require('mongoose');

const exprienceSchema = new mongoose.Schema({
    experience:[{
        type: String,
        trim: true
     }],
     work:{
       type: String,
       trim: true
     },
     from:[{
       type: String,
       trim: true
     }],
     to:[{
       type: String,
       trim: true
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