// model employee
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
      fullName: {
        type: String,
        required: true
      },
      fatherName: {
        type: String,
       
      },
      motherName:{
        type: String,
       
      },
      dob:{
        type: String,
        // required: true
      },
      gender:{
        type: String,
        // required: true
      },
      maritalStatus:{
        type: String,
        
      },
      phoneNumber:{
        type: String,
        required: true,
        unique:true
      },
      email:{
        type: String,
        unique: true,
        required: false
      },
      empImg:{
        type: String,
        
      },
      aadhaar:{
        type: String,
       
      },
      aadhaarPanUp:{     // aadhaar and pan document
        type: String,
       
      },
      pan:{
        type: String,
       
      },
      address:{
        type: String,
        // required: true
      },
      permenentadrs:{
        type: String,
        // required: true
      },
      emgContact:{
        type: String,
        // required: true
      },
      emgRelation:{
        type: String,
        // required: true
      },
      emgNumber:{
        type: String,
        // required: true
      },
      empId:{
        type: String,
        required: true,
        unique: true,
      },
      doj:{
        type: String,
        // required: true
      },
      type:{
        type: String,
        required: true
      },
      organization:{
        type: String,
        // required: true
      },
      team:{
        type: String,
      
      },
      status:{
        type: String,
        default: 'Active',
      },
      exitformalities:{
        type: String,
        // default:'Active' 
      },
      managerName:{
        type: String,
     
      },
      ismanager:{
       type: Boolean,
       default: false,
       required: true,
      
      },
      designation:{
        type: String,
       
      },
      country:{
        type: String,
        // required: true
      },
      state:{
        type: String,
        // required: true
      },
      district:{
        type: String,
        // required: true
      },
      mandal:{
        type: String,
        // required: true
      },
      village:{
        type: String,
        // required: true
      },
      lpa:{
        type: String,

      },
      nameapb:{
        type: String,

      },
      salary:{
        type: String,
        required: true
      },
      netsalary:{
        type: String,
        required: true
      },
      basic:{
        type: String,
        required: true
      },
      hra:{
        type: String,
        required: true
      },
      ca:{
        type: String,
        required: true
      },
      medical:{
        type: String,
       
      },
      other:{
        type: String,
     
      },
      petrolAllow:{
        type: Boolean,
        default:false,
        required: true,
     
      },
      incentives:{
        type: Boolean,
        default: false,
        required:true,
      },
      spcialAllowances:{
        type: Boolean,
        default: false
      },
      Arrears:{
        type: Boolean,
        default: false
               
       
      },
      pf:{
        type: Boolean,
        default:false
       
      },
      allowance:{
        type: String,
       
      },
      pt:{
        type: String,
        default: false
      },
      vehicle:{
        type: Boolean,
        default: false
      },
      esi:{
        type: Boolean,
        default: false
      },
      esinumber:{
        type: String,
       
      },
      genratedeis:{
        type: String,
       
      },
      tds:{
        type: String,
       
      },
      insurance:{
        type: String,
   
      },
      loan:{
        type: String,
 
      },
      bankName:{
        type: String,
        required: true

      },
      accNo:{
        type: String,
        required: true,
        unique: true,
      },
      uanNumber:{
        type: String,
        
      },
      ifscNumber:{
        type: String,
        // required: true
      },
     
      contractStart:{
        type:String,

      },
      contractEnd:{
        type:String,

      },
      pfNo:{
        type:String,
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      },
      userId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User' 
        },
        kyc: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Kyc',
        },
        education: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Education',
        },
        exprience:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Expirence'
        }
    });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee