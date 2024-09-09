const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: String,
    country_name: String
});


// const State = mongoose.model('States', stateSchema);
const State = mongoose.model('State', stateSchema);

module.exports = State