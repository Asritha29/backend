// models/client
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  clientName:{
    type:String,
    require:true,
  },
  contName:{
    type:String,
    require:true,
  },
  conNumber:{
    type:Number,
    require:true,
  },
  clientEmail:{
    type:String,
    required:true
  },
  address:{
    type:String,
    
  },
  ismainClient:{
    type:Boolean,
    required:true,
    default:false
  },
  mainClient:{
    type:String,
    // required:true
  },
  gstNumber:{
    type:String,

  },
  workOrder:{
    type:String,

  },
  status:{
    type:String,
    required:true,
    default:'Active'
  },
  contractStart:{
    type:String,
    
  },
  contractEnd:{
    type:String,
   
  }
});


const client = mongoose.model('clients', ClientSchema);

module.exports = client