const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({

    titre: {
        type: String,
        required: true
    },

    contenu: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Announcement",
    announcementSchema
);