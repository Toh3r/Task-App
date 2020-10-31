const mongoose = require('mongoose');
const validator = require('validator');


// Craete model passing in model name and fields
const User = mongoose.model('User', {
    name: {
        type: String,
        // From Mongoose
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid...')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        // Validation function
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (value.length < 6) {
                throw new Error('Password must be greater than 6 characters');
            }
            if (value === 'password') {
                throw new Error('Password cannot be "password"');
            }
        }
    }
});

module.exports = User;