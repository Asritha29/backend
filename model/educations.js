const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({

  course:[{
        type: String,
        required: false,
        trim: true
      }],
      courseType:[{
        type: String,
        required: false,
        trim: true
      }],
      fromDate:[{
        type: String,
        required: false,
        trim: true
      }],
      toDate:[{
        type: String,
        required: false,
        trim: true
      }],
      educationdoc:[{
        type:String,
        trim: true,
        required: false,
      }],
      empId:{
        type:String,
        
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        // required: true 
    },

    
});


const Education = mongoose.model('Education', EducationSchema);

module.exports = Education