
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    nom: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    sujet: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Message",
    messageSchema
);

