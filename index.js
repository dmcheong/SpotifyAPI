const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const multer = require('multer');
const redis = require('redis');

// Routes
const audioRoutes = require('./routes/audioRoutes');
const albumRoutes = require('./routes/albumRoutes');
const artisteRoutes = require('./routes/artisteRoutes');
const musiqueRoutes = require('./routes/musiqueRoutes');

// Connexion à la base de données MongoDB
const mongoose = require('./src/config/mongodb-config'); // Assurez-vous que le chemin est correct

// Connexion à AWS S3
const s3 = require('./src/config/aws-config'); // Assurez-vous que le chemin est correct

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// // Configurations Multer pour le traitement des fichiers
// const storage = multer.memoryStorage();
// // const upload = multer({ storage: storage });

// // Configurations Redis
// const client = redis.createClient();

// Définissez vos routes et vos contrôleurs ici
app.use('/api/audio', audioRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/artistes', artisteRoutes);
app.use('/api/musiques', musiqueRoutes);

// Écoutez le port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
