const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const Chat = mongoose.model('messages', ChatSchema)

module.exports = Chat