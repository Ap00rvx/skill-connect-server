const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array
    },
    messages: {
        type: Array,
        default: []
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);