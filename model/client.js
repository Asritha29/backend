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
    // require:true,
  },
  clientEmail:{
    type:String,
    // required:true
  },
  address:{
    type:String,
    
  },
  ismainClient:{
    type:Boolean,
    // required:true,
    default:false
  },
  mainClient:{
    type:String,
    // required:true
  },
  // mainClientId:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'clients', 
  //   default: null,
  // },
  gstNumber:{
    type:String,

  },
  workOrder:{
    type:String,

  },
  status:{
    type:String,
    // enum: ['Active', 'Inactive'],
    default:'Active'
  },
  contractStart:{
    type:String,
    
  },
  contractEnd:{
    type:String,
   
  }
});


// ClientSchema.pre('save', function(next) {
//   if (this.isMainClient && this.mainClientId) {
//     return next(new Error("A client cannot be both a main client and a sub-client."));
//   }
//   next();
// });

const Client = mongoose.model('clients', ClientSchema);

module.exports = Client;