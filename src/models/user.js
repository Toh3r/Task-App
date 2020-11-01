const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a user schema using validation provided by mongoose and
// validation created using validator npm
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Only return non-sensitive user data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

// Create token for user, methods = functions on user instance
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'myToken'); // Create token

    user.tokens = user.tokens.concat({ token }); // Save token to token list
    await user.save(); // Save user after token has been added

    return token;
}

// Check login details of user, statics = function on User model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}

// Middleware runs before user is saved
userSchema.pre('save', async function(next) {
    const user = this;

    // If password is changed, hash the password
    // isModified is a mongoose function, return true if shit was modified
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    // On function complete
    next();
});

// Craete model passing in model name and fields
const User = mongoose.model('User', userSchema);

module.exports = User;