const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const mm = require('music-metadata');

const uri = process.env.MONGODB_URI;

// Nouvelle configuration de connexion MongoDB
const mongoOptions = {
    useNewUrlParser: true, // Note: Ce n'est plus nécessaire, mais peut être laissé pour la compatibilité
    useUnifiedTopology: true,
  };
  
// Connexion à la base de données MongoDB
mongoose.connect(uri, mongoOptions);

const Album = mongoose.model('Album', {
    titre: { type: String, required: true },
    artiste: { type: mongoose.Schema.Types.ObjectId, ref: 'Artiste', required: true },
    audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
    dateSortie: { type: Date },
    urlAffichage: { type: String },
});

const Artiste = mongoose.model('Artiste', {
    nom: { type: String, required: true },
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
});

const Audio = mongoose.model('Audio', {
    titre: { type: String, required: true },
    artiste: { type: mongoose.Schema.Types.ObjectId, ref: 'Artiste', required: true },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
    duree: { type: Number, required: true },
});

async function readAudioFiles(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await readAudioFiles(filePath); // Récursion pour les sous-dossiers
    } else if (file.endsWith('.mp3') || file.endsWith('.wav')) {
      await processAudioFile(filePath);
    }
  }
}

async function processAudioFile(filePath) {
  try {
    const metadata = await mm.parseFile(filePath, { duration: true });

    const artiste = new Artiste({ nom: metadata.common.artist || 'Unknown Artist' });
    await artiste.save();

    const album = new Album({
      titre: metadata.common.album || 'Unknown Album',
      artiste: artiste._id,
      dateSortie: metadata.common.date || null,
      urlAffichage: 'URL de l\'album',  // Remplacez par la véritable URL
    });
    await album.save();

    const audio = new Audio({
      titre: metadata.common.title || path.basename(filePath, path.extname(filePath)),
      artiste: artiste._id,
      album: album._id,
      duree: Math.ceil(metadata.format.duration) || 0,
    });

    await audio.save();

    // Mettez à jour les références dans les documents parent (Artiste et Album)
    artiste.audios.push(audio._id);
    await artiste.save();

    album.audios.push(audio._id);

    await audio.save();
    console.log(`Enregistré dans la base de données: ${filePath}`);
  } catch (error) {
    console.error(`Erreur lors du traitement du fichier ${filePath}: ${error.message}`);
  }
}

const directoryPath = 'd:\\test';
readAudioFiles(directoryPath);
