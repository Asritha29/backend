// models/country.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: String,
    iso2: String
});


const Country = mongoose.model('Countrys', countrySchema);

module.exports = Country