const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const cors = require("cors");

// Routes
const audioRoutes = require('./src/routes/AudioRoutes');
const albumRoutes = require('./src/routes/AlbumRoutes');
const artisteRoutes = require('./src/routes/ArtistesRoutes');

// Connexion à la base de données MongoDB
const mongoose = require('./src/config/mongodb-config');

// Connexion à AWS S3
const s3 = require('./src/config/aws-config');

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());
app.use(cors());

// Route de bienvenue
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

// // Définissez vos routes et vos contrôleurs ici
app.use('/api/audios', audioRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/artistes', artisteRoutes);

// Écoutez le port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
