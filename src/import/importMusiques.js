const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const mm = require('music-metadata');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '../../.env' });

// Configuration AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const caPath = path.resolve(__dirname, '../config/ca.pem');
const uri = process.env.MONGODB_URI;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: caPath,
  tlsAllowInvalidCertificates: true,
};

// Configuration MongoDB
mongoose.connect(uri, mongoOptions);
console.log(process.env.MONGODB_URI);

// Modèle MongoDB pour les données audio
const Audio = mongoose.model('Audio', new mongoose.Schema({
  audio_id: String,
  title: String,
  artist: String,
  album: String,
  duration: String,
  urlAudio: String,
  album: {
    type: String,
  },
  // Autres métadonnées audio
}));

// Modèle MongoDB pour les données d'artiste
const Artiste = mongoose.model('Artiste', new mongoose.Schema({
  artist_id: String,
  name: String,
  albums: [String],
  audio: [String],
  // Autres métadonnées artiste
}));

// Modèle MongoDB pour les données d'album
const Album = mongoose.model('Album', new mongoose.Schema({
  album_id: String,
  title: String,
  artist: String,
  cover_url: String,
  tracks: [
    {
      track_id: String,
      title: String,
      duration: String,
      // Autres métadonnées de piste
    }
    // ... d'autres pistes
  ]
}));

// Répertoire local contenant les fichiers audio
const localAudioDirectory = './MusiqueLibrayrie';

// Fonction pour lister tous les fichiers audio dans le répertoire local et ses sous-répertoires
async function listAllAudioFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    const audioFiles = [];

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Récursion pour les sous-répertoires
        const subDirectoryFiles = await listAllAudioFiles(filePath);
        audioFiles.push(...subDirectoryFiles);
      } else if (file.isFile() && file.name.endsWith('.m4a')) {
        audioFiles.push(filePath);
      }
    }

    return audioFiles;
  } catch (error) {
    console.error(`Erreur lors de la liste des fichiers dans le répertoire ${dir} :`, error);
    throw error;
  }
}

// Fonction pour importer les données dans AWS S3
async function uploadToS3(localFilePath, s3Key) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: fs.createReadStream(localFilePath),
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`Fichier ${localFilePath} uploadé avec succès vers ${data.Location}`);
    return data.Location;
  } catch (error) {
    console.error(`Erreur lors de l'upload du fichier ${localFilePath} vers S3 :`, error);
    throw error;
  }
}

// Fonction pour extraire les métadonnées d'un fichier audio local
async function extractMetadata(localFilePath) {
  try {
    const metadata = await mm.parseFile(localFilePath);

    // Extraction du nom du dossier comme titre de l'album
    const albumTitle = path.basename(path.dirname(localFilePath));

    // Charge la couverture du fichier audio (si disponible)
    const cover = metadata.common.picture && metadata.common.picture.length > 0 ? metadata.common.picture[0] : null;

    return {
      titre: metadata.common.title || 'Inconnu',
      artiste: metadata.common.artist || 'Inconnu',
      album: albumTitle || 'Inconnu',
      duree: Math.round(metadata.format.duration),
      cover: cover ? cover.data.toString('base64') : null,
    };
  } catch (error) {
    console.error(`Erreur lors de l'extraction des métadonnées du fichier ${localFilePath} :`, error);
    throw error;
  }
}

// Fonction principale pour importer les fichiers locaux dans S3 et les données dans MongoDB
async function importLocalFiles() {
  try {
    // Liste de tous les fichiers audio dans le répertoire local et ses sous-répertoires
    const localFiles = await listAllAudioFiles(localAudioDirectory);

    // Importe chaque fichier dans S3 et les données dans MongoDB
    for (const localFilePath of localFiles) {
      // Extrait les métadonnées du fichier local
      const metadata = await extractMetadata(localFilePath);

      // Upload le fichier dans S3
      const s3Key = `ynovSpotify/${metadata.artiste} - ${metadata.album}/tracks/${metadata.titre}.m4a`;
      const s3Url = await uploadToS3(localFilePath, s3Key);

      // Création de l'artiste s'il n'existe pas
      let artiste = await Artiste.findOne({ name: metadata.artiste });
      if (!artiste) {
        artiste = await Artiste.create({
          artist_id: new mongoose.Types.ObjectId(),
          name: metadata.artiste,
        });
      }

      // Création de l'album s'il n'existe pas
      let album = await Album.findOne({ title: metadata.album, artist: metadata.artiste });
      if (!album) {
        album = await Album.create({
          album_id: new mongoose.Types.ObjectId(),
          title: metadata.album,
          artist: metadata.artiste,
          cover_url: metadata.cover,
        });
        artiste.albums.push(album.album_id);
        await artiste.save();
      }

      // Enregistrement dans MongoDB avec l'URL de la couverture
      const newAudio = await Audio.create({
        audio_id: new mongoose.Types.ObjectId(),
        title: metadata.titre,
        artist: metadata.artiste,
        album: album.album_id,
        duration: metadata.duree.toString(),
        urlAudio: s3Url,
        // ... autres champs spécifiques à Audio
      });

      album.tracks.push({
        track_id: newAudio.audio_id,
        title: metadata.titre,
        duration: metadata.duree.toString(),
      });

      await album.save();

      console.log(`Données importées depuis ${localFilePath}`);
    }

    console.log('Importation terminée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'importation des données :', error);
  } finally {
    // Déconnecte Mongoose après l'opération
    mongoose.disconnect();
  }
}

// Exécute la fonction d'importation
importLocalFiles();

