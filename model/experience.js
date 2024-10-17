const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    experience: {
        type: String,
        trim: true,
        required: false
    },
    work: {
        type: String,
        trim: true,
        required: false
    },
    from: {
        type: String,
        trim: true,
        required: false
    },
    to: {
        type: String,
        trim: true,
        required: false
    },
    experiencedoc: {
        type: String,
    },
    empId: {
        type: String,
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
});

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;
