const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Please provide a title']}
        ,
    description: {
        type: String, 
        required: [true, 'Please provide a description']
    },
    contents: {
        type: String, 
        required: [true, 'Please provide content for your post']
    },
    userObj: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // IMPORTANT: This must match the name of the model as defined in NodeJS in the 'mongoose.model' value
        required: true
    },
    createdAt: {
        type: Date, 
        default:  new Date()
    }
});

module.exports = mongoose.model('Post',PostSchema);