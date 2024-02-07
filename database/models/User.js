const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'Please provide your username']
        },
    email: {
        type: String, 
        required: [true, 'Please provide your email address'], 
        lowercase: true, 
        trim: true,
        unique: true
    },
    password: {
        type: String, 
        required: [true, 'Please provide your password']
    },
    createdAt: {
        type: Date, 
        default:  new Date()
    }
});

// Hooks
UserSchema.pre('save', function(next) {
    // Document is referenced by 'this'
    const user = this;
    bcrypt.hash(user.password, 10, (error,encrypted) => {
        user.password = encrypted;
        // Need to tell NodeJS that middleware complete by referencing 'next()'
        next()
    })
})

module.exports = mongoose.model('User',UserSchema);