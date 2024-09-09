const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({

  course:[{
        type: String,
        required: false
        // required: true
      }],
      courseType:[{
        type: String,
        required: false
        // required: true
      }],
      fromDate:[{
        type: String,
        required: false
        // required: true
      }],
      toDate:[{
        type: String,
        required: false
        // required: true
      }],
      educationdoc:[{
        type:String,

      }],
      empId:{
        type:String,
        
      }

    
});


const Education = mongoose.model('Education', EducationSchema);

module.exports = Education