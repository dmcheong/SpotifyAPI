// index.js
const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const redis = require('redis');
const musiqueRoutes = require('./TRASH/musiqueRoutes');

require('dotenv').config();

const uri = process.env.MONGODB_URI;

// Nouvelle configuration de connexion MongoDB
const mongoOptions = {
  useNewUrlParser: true, // Note: Ce n'est plus nécessaire, mais peut être laissé pour la compatibilité
  useUnifiedTopology: true,
};

// Connexion à la base de données MongoDB
mongoose.connect(uri, mongoOptions);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connexion à MongoDB établie avec succès');
});
connection.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB : ', err);
});

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// Configurations Multer pour le traitement des fichiers
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// Configurations Redis
const client = redis.createClient();

// Définissez vos routes et vos contrôleurs ici
app.use('/', musiqueRoutes);

// Écoutez le port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
