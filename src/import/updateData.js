const mongoose = require('mongoose');
const mm = require('music-metadata');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '../../.env' });

const caPath = path.resolve(__dirname, '../config/ca.pem');
const uri = process.env.MONGODB_URI;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: caPath,
  tlsAllowInvalidCertificates: true,
};

mongoose.connect(uri, mongoOptions);
console.log(process.env.MONGODB_URI);

const Audio = mongoose.model('Audio', new mongoose.Schema({
  title: String,
  artistes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste'
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  duration: String,
  urlAudio: String,
  // Autres métadonnées audio
}));

const Artiste = mongoose.model('Artiste', new mongoose.Schema({
  name: String,
  first_name: String,
  last_name: String,
  full_name: String,
  cover_url: String,
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    }
    // ... d'autres albums
  ],
  audios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Audio'
    }
    // ... d'autres pistes audio
  ],
  // Autres métadonnées artiste
}));

const Album = mongoose.model('Album', new mongoose.Schema({
  title: String,
  artistes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste'
  }],
  date_sortie: String,
  cover_url: String,
  audios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Audio'
    }
    // ... d'autres pistes
  ]
}));

const localAudioDirectory = './MusiqueLibrayrie';

async function listAllAudioFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    const audioFiles = [];

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
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

async function extractMetadata(localFilePath) {
  try {
    const metadata = await mm.parseFile(localFilePath);
    const albumTitle = path.basename(path.dirname(localFilePath));
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

// Fonction pour obtenir l'URL d'accès public du fichier audio dans AWS S3
function getPublicUrlFromS3(s3Key) {
    const s3Bucket = process.env.S3_BUCKET;
    const s3Url = `https://${s3Bucket}.s3.amazonaws.com/${s3Key}`;
    console.log(`URL publique générée avec succès pour ${s3Key}`);
    return s3Url;
}

// Fonction pour l'insertion des données
async function insertData(localFiles) {
  try {
    for (const localFilePath of localFiles) {
      const metadata = await extractMetadata(localFilePath);

      // Obtenez ou créez l'artiste
      let artiste = await Artiste.findOne({ name: metadata.artiste });
      if (!artiste) {
        artiste = new Artiste({
          name: metadata.artiste,
          first_name: metadata.artistFirstName,
          last_name: metadata.artistLastName,
          full_name: metadata.artistFullName,
          cover_url: metadata.artistCoverURL,
          albums: [],
          audios: [],
          // ... d'autres champs d'artiste à partir des métadonnées
        });
        await artiste.save();
      }

      // Obtenez ou créez l'album
      let album = await Album.findOne({ title: metadata.album, cover_url: metadata.cover });
      if (!album) {
        album = new Album({
          title: metadata.album,
          artistes: [artiste._id],
          cover_url: metadata.cover,
          audios: [],
          // ... d'autres champs d'album à partir des métadonnées
        });
        await album.save();
      }

      // Utilisation de la fonction
      const s3Key = `ynovSpotify/${metadata.artiste} - ${metadata.album}/tracks/${metadata.titre}.m4a`;
      const s3Url = getPublicUrlFromS3(s3Key);

      // Recherchez ou créez l'audio en utilisant le nouveau schéma
      let audio = await Audio.findOne({ title: metadata.titre, duration: metadata.duree, cover_url: metadata.cover });
      if (!audio) {
        // Créez un nouvel audio avec le nouveau schéma
        audio = new Audio({
          title: metadata.titre,
          artistes: [artiste._id],
          albums: [album._id], // Ajoutez directement l'ID de l'album dans le schéma Audio
          cover_url: metadata.cover,
          duration: metadata.duree.toString(),
          urlAudio: s3Url,
          // ... autres métadonnées audio
        });
        await audio.save();
      }

      // Ajoutez l'ID de l'artiste à la liste de l'album
      artiste.albums.push(album._id);

      // Ajoutez l'ID de l'audio à la liste de l'artiste
      artiste.audios.push(audio._id);
      await artiste.save();

      // Ajoutez l'ID de l'audio à la liste de l'album
      album.audios.push(audio._id);
      await album.save();

      // Ajoutez l'ID de l'album à la liste de l'audio
      audio.albums.push(album._id);

      // Utilisez populate pour récupérer les ID des artistes et des albums si nécessaire
      console.log(`Données importées depuis ${localFilePath}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
    throw error;
  }
}


// Fonction pour effectuer les opérations populate
async function performPopulate() {
  try {
    // Utilisez populate pour récupérer les ID des artistes et des albums si nécessaire
    await Audio.populate({ path: 'albums', select: '_id' });
    await Artiste.populate({ path: 'audios albums', select: '_id' });
    await Album.populate({ path: 'audios', select: '_id' });

    console.log('Opérations populate terminées avec succès.');
  } catch (error) {
    console.error('Erreur lors du peuplement des relations :', error);
    throw error;
  } finally {
    mongoose.disconnect();
  }
}

// Fonction principale
async function importLocalFiles() {
  try {
    const localFiles = await listAllAudioFiles(localAudioDirectory);

    // Étape 1 : Insertion des données
    await insertData(localFiles);

    // Étape 2 : Populate
    await performPopulate();
  } catch (error) {
    console.error('Erreur lors de l\'importation des données :', error);
  }
}

importLocalFiles();
