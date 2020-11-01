const mongoose = require('mongoose');

// Craete model passing in model name and fields
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // Link task to a user
        required: true,
        ref: 'User'
    }
});

module.exports = Task;