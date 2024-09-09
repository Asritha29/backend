// models/districs.js
const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
district: String,
state: String,
country:String,
mandal:String,
village:String,
});

const District = mongoose.model('District', districtSchema);

module.exports = District