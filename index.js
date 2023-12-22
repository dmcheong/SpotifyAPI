const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const multer = require('multer');
const redis = require('redis');
const cors = require("cors");

// Routes
const audioRoutes = require('./src/routes/AudioRoutes');
const albumRoutes = require('./src/routes/AlbumRoutes');
const artisteRoutes = require('./src/routes/ArtistesRoutes');
const playlistRoutes = require('./src/routes/PlaylistRoutes');

// Connexion à la base de données MongoDB
const mongoose = require('./src/config/mongodb-config'); // Assurez-vous que le chemin est correct

// Connexion à AWS S3
const s3 = require('./src/config/aws-config'); // Assurez-vous que le chemin est correct

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());
app.use(cors());
// // Configurations Multer pour le traitement des fichiers
// const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });

// // Configurations Redis
// const client = redis.createClient();

// Route de bienvenue
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

// Définissez vos routes et vos contrôleurs ici
app.use('/api/audios', audioRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/artistes', artisteRoutes);
app.use('/api/playlist', playlistRoutes);

// Écoutez le port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
