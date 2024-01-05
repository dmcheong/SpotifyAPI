const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const multer = require('multer');
const redis = require('redis');
const client = redis.createClient();
const util = require('util');
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

// Configurations Multer pour le traitement des fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// // Configurations Redis
// const client = redis.createClient();

// Route de bienvenue
app.get('/', (req, res) => {
  res.send('Bienvenue sur votre API !');
});

// // Définissez vos routes et vos contrôleurs ici
// app.use('/api/audios', audioRoutes);
// app.use('/api/albums', albumRoutes);
// app.use('/api/artistes', artisteRoutes);
// app.use('/api/playlist', playlistRoutes);

// Utiliser le middleware upload pour les routes qui nécessitent le téléchargement de fichiers
app.use('/api/audios', upload.fields([]), audioRoutes);
app.use('/api/albums', upload.fields([]), albumRoutes);
app.use('/api/artistes', upload.fields([]), artisteRoutes);
app.use('/api/playlist', upload.fields([]), playlistRoutes);

// Utilisez promisify pour transformer les fonctions Redis en fonctions promisifiées
const getAsync = util.promisify(client.get).bind(client);
const setAsync = util.promisify(client.set).bind(client);

// Exemple d'utilisation dans un routeur ou contrôleur
app.get('/api/audios/audio_id', async (req, res) => {
  const audioId = req.params.audioId;

  try {
    // Vérifie si les données audio sont en cache
    const result = await getAsync(`audio:${audioId}`);

    if (result) {
      // Les données sont en cache, les renvoyer
      res.json(JSON.parse(result));
    } else {
      // Les données ne sont pas en cache, récupérez-les depuis la base de données
      const audioDetailsFromDB = await fetchAudioDetailsFromDB(audioId);

      // Mettez en cache les résultats pour les prochaines requêtes
      await setAsync(`audio:${audioId}`, JSON.stringify(audioDetailsFromDB));

      // Renvoyez les données récupérées
      res.json(audioDetailsFromDB);
    }
  } catch (error) {
    console.error('Erreur Redis : ', error);
    // Gérer l'erreur
    res.status(500).json({ error: 'Erreur lors de la récupération des données audio.' });
  }
});

// Exemple d'utilisation dans un routeur ou contrôleur pour les albums
app.get('/api/album/album_id', async (req, res) => {
  const albumId = req.params.albumId;

  try {
    // Vérifie si les données de l'album sont en cache
    const result = await getAsync(`album:${albumId}`);

    if (result) {
      // Les données sont en cache, les renvoyer
      res.json(JSON.parse(result));
    } else {
      // Les données ne sont pas en cache, récupérez-les depuis la base de données
      const albumDetailsFromDB = await fetchAlbumDetailsFromDB(albumId);

      // Mettez en cache les résultats pour les prochaines requêtes
      await setAsync(`album:${albumId}`, JSON.stringify(albumDetailsFromDB));

      // Renvoyez les données récupérées
      res.json(albumDetailsFromDB);
    }
  } catch (error) {
    console.error('Erreur Redis : ', error);
    // Gérer l'erreur
    res.status(500).json({ error: 'Erreur lors de la récupération des données de l\'album.' });
  }
});

// Écoutez le port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
