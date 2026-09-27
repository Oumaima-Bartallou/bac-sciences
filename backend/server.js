const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Document = require("./models/Document");
const Announcement = require("./models/Announcement");
const Message = require("./models/Message");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// Middleware
// ======================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Frontend
// ======================

app.use(express.static(path.join(__dirname, "..")));
app.use("/backend/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// Connexion MongoDB
// ======================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connectée ✅");
    })
    .catch((error) => {
        console.error("Erreur MongoDB ❌", error.message);
    });

// ======================
// Configuration PDF
// ======================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },

    filename: (req, file, cb) => {
        const nom = Date.now() + "-" + file.originalname;
        cb(null, nom);
    }

});

const upload = multer({

    storage: storage,

    fileFilter: (req, file, cb) => {

        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Seulement les fichiers PDF sont acceptés."));
        }

    }

});

// ======================
// Route test
// ======================

app.get("/", (req, res) => {

    res.send("Backend BAC Sciences fonctionne !");

});

// ======================
// Upload PDF
// ======================

app.post("/upload", upload.single("pdf"), async (req, res) => {

    try {

        if (!req.file) {

            return res
                .status(400)
                .send("Aucun PDF sélectionné.");

        }


        const {
            title,
            subject,
            type,
            annee
        } = req.body;


        if (!title || !subject || !type) {

            return res
                .status(400)
                .send("Informations manquantes.");

        }


        const document = new Document({

            titre: title,

            matiere: subject,

            type: type,

            annee: annee
                ? Number(annee)
                : undefined,

            fichier: req.file.filename

        });


        await document.save();


        res.send(`

            <h2>
                PDF ajouté avec succès ✅
            </h2>

            <p>
                <strong>Titre :</strong>
                ${title}
            </p>

            <p>
                <strong>Matière :</strong>
                ${subject}
            </p>

            <p>
                <strong>Type :</strong>
                ${type}
            </p>

            ${
                annee
                    ? `
                    <p>
                        <strong>Année :</strong>
                        ${annee}
                    </p>
                    `
                    : ""
            }

            <p>
                <strong>Fichier :</strong>
                ${req.file.filename}
            </p>

        `);

    }

    catch (error) {

        console.error(
            "Erreur upload ❌",
            error
        );

        res
            .status(500)
            .send(
                "Erreur lors de l'ajout du document ❌"
            );

    }

});
// ======================
// Get all documents
// ======================

app.get("/documents", async (req, res) => {

    try {

        const documents = await Document.find();

        res.json(documents);

    } catch (error) {

        console.error("Erreur récupération ❌", error);

        res.status(500).json({
            message: "Erreur lors de la récupération des documents"
        });

    }

});
// ===============================
// ANNONCES
// ===============================

app.post("/annonces", async (req, res) => {

    try {

        const {
            titre,
            contenu
        } = req.body;


        if (!titre || !contenu) {

            return res
                .status(400)
                .json({
                    message: "Titre et contenu obligatoires."
                });

        }


        const annonce =
            new Announcement({

                titre: titre,

                contenu: contenu

            });


        await annonce.save();


        res.status(201).json({

            message: "Annonce ajoutée avec succès ✅",

            annonce: annonce

        });

    }

    catch (error) {

        console.error(
            "Erreur annonce ❌",
            error
        );

        res.status(500).json({

            message:
                "Erreur lors de l'ajout de l'annonce."

        });

    }

});


app.get("/annonces", async (req, res) => {

    try {

        const annonces =
            await Announcement
                .find()
                .sort({
                    date: -1
                });


        res.json(annonces);

    }

    catch (error) {

        console.error(
            "Erreur récupération annonces ❌",
            error
        );

        res.status(500).json({

            message:
                "Erreur lors de la récupération des annonces."

        });

    }

});

// =========================
// CONTACT
// =========================

app.post("/messages", async (req, res) => {

    try {

        const {
            nom,
            email,
            sujet,
            message
        } = req.body;


        if (
            !nom ||
            !email ||
            !sujet ||
            !message
        ) {

            return res.status(400).json({

                message:
                    "Tous les champs sont obligatoires."

            });

        }


        const nouveauMessage =
            new Message({

                nom: nom,
                email: email,
                sujet: sujet,
                message: message

            });


        await nouveauMessage.save();


        res.status(201).json({

            message:
                "Votre message a été envoyé avec succès ✅",

            data: nouveauMessage

        });


    } catch (error) {

        console.error(
            "Erreur message ❌",
            error
        );


        res.status(500).json({

            message:
                "Erreur lors de l'envoi du message."

        });

    }

});

// =========================
// GET MESSAGES
// =========================

app.get("/messages", async (req, res) => {

    try {

        const messages = await Message
            .find()
            .sort({ date: -1 });

        res.json(messages);

    } catch (error) {

        console.error(
            "Erreur récupération messages ❌",
            error
        );

        res.status(500).json({
            message:
                "Erreur lors de la récupération des messages."
        });

    }

});




// ======================
// Serveur
// ======================

app.listen(PORT, () => {

    console.log(
        `Serveur lancé sur http://localhost:${PORT}`
    );

});