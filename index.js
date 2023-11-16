// index.js
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const redis = require('redis');
const musiqueRoutes = require('./src/routes/musiqueRoutes');

require('dotenv').config();

// Nouvelle configuration de connexion MongoDB
const mongoOptions = {
    useNewUrlParser: true, // Note: Ce n'est plus nécessaire, mais peut être laissé pour la compatibilité
    useUnifiedTopology: true,
};

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, mongoOptions);

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// Configurations Multer pour le traitement des fichiers
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// Configurations Redis
const client = redis.createClient();

// Définissez vos routes et vos contrôleurs ici
// Utilisez les routes définies dans musiqueRoutes.js
app.use('/', musiqueRoutes);

// Écoutez le port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
