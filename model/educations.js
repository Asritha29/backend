const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  empId: {
    type:String,
    required: true,
  },
  EducationDetails: [
    {
      course: String,
      courseType: String,
      institution: String,
      fromDate: Date,
      toDate: Date,
      Educationdoc: String,
    }
  ],
});
const Education = mongoose.model('Education' , educationSchema);
module.exports = Education;