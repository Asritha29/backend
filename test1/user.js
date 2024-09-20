// models/Employee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employee1Schema = new Schema({
  name: { type: String, required: true },
  documentUrl: { type: String }, // Store the URL of the document
  // Add other fields as necessary
});

module.exports = mongoose.model('Employee1', employee1Schema);
