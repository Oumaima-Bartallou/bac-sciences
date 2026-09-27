const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({

    titre: {
        type: String,
        required: true
    },

    matiere: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [
            "cours",
            "exercices",
            "sujets",
            "corrections"
        ],
        required: true
    },

    annee: {
        type: Number,
        required: false
    },

    fichier: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Document", documentSchema);