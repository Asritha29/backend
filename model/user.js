// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    eId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        // required: true 
    },
    empId:{
        type: String,
        required: true,
        unique: true 
    },
    role:{
        type:String,
        required:true,  
        enum: ['Admin', 'User', 'Hr'],
        default: 'User',
    },
    isFirstLogin:{
        type:Boolean, 
        default:true,
    }
     
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
