const Audio = require('../../models/AudioModel');
const { uploadToS3 } = require('../../config/aws-config');
const mm = require('music-metadata');
const createArtiste = require('../../controllers/Artiste/createArtiste');

const processAndUploadAudio = async (audioBuffer, tempAudioFilePath, name) => {
  try {
    console.log('Avant la création du répertoire temporaire');
    const tempDir = tempAudioFilePath.replace(/\/[^\/]+$/, '');
    console.log('Après la création du répertoire temporaire');

    // Créer le répertoire s'il n'existe pas
    require('fs').mkdirSync(tempDir, { recursive: true });

    // Convertir le buffer audio en fichier temporaire
    console.log('Avant l\'écriture du fichier temporaire');
    require('fs').writeFileSync(tempAudioFilePath, audioBuffer);
    console.log('Après l\'écriture du fichier temporaire');

    // Extraction des métadonnées
    console.log('Avant l\'extraction des métadonnées');
    const metadata = await mm.parseFile(tempAudioFilePath);
    console.log('Après l\'extraction des métadonnées');

    // Traitement des métadonnées
    const title = metadata.common.title || 'Untitled';
    const duration = metadata.format.duration || '0:00';

    // Supprimer le fichier temporaire
    console.log('Avant la suppression du fichier temporaire');
    require('fs').unlinkSync(tempAudioFilePath);
    console.log('Après la suppression du fichier temporaire');

    // Appeler le contrôleur createArtiste pour créer l'artiste si nécessaire
    console.log('Avant la création de l\'artiste');
    const savedArtiste = await createArtiste({ name });
    console.log('Après la création de l\'artiste');

    // Enregistrement dans MongoDB avec l'URL du fichier audio
    console.log('Avant la création de l\'objet Audio');
    const newAudio = new Audio({
      title: title,
      artist: savedArtiste._id,
      albums: [], // À ajuster selon votre logique
      duration: duration,
      urlAudio: '', // À remplir après l'upload vers S3
      // ... autres champs
    });

    const savedAudio = await newAudio.save();

    // Mettre à jour le champ artistes avec l'ID de l'artiste créé
    savedArtiste.audios.push(savedAudio._id);
    await savedArtiste.save();

    // Ajouter le fichier audio à S3
    console.log('Avant l\'upload vers S3');
    const s3AudioUrl = await uploadToS3({
      buffer: Buffer.from(audioBuffer),
      originalname: `${title}.m4a`,
    });
    console.log('Après l\'upload vers S3');

    // Mettre à jour l'URL du fichier audio dans la base de données
    savedAudio.urlAudio = s3AudioUrl;
    await savedAudio.save();

    console.log('Avant le retour de l\'objet Audio');
    return savedAudio;
  } catch (error) {
    console.error('Erreur lors du traitement audio : ', error);

    if (error instanceof mm.ValidationError) {
      return Promise.reject('Les métadonnées audio sont invalides.');
    } else if (error.code === 'ENOENT') {
      return Promise.reject('Fichier temporaire non trouvé lors du traitement audio.');
    } else {
      return Promise.reject('Une erreur inattendue est survenue lors du traitement audio.');
    }
  }
};

const createAudio = async (req, res) => {
  try {
    let audioBuffer;
    let tempAudioFilePath;

    // Vérifier si le fichier audio est envoyé par createAlbum
    if (req.file) {
      audioBuffer = req.file.buffer;
      tempAudioFilePath = `chemin-temporaire/${req.file.originalname}.mp3`;
    } else {
      // Si le fichier audio est créé indépendamment
      audioBuffer = req.body.audioBuffer; // Ajoutez cette propriété dans la requête
      tempAudioFilePath = `chemin-temporaire/indépendant.mp3`; // Nom de fichier temporaire générique
    }

    const savedAudio = await processAndUploadAudio(audioBuffer, tempAudioFilePath, req.body.name);

    res.status(201).json(savedAudio);
  } catch (error) {
    console.error('Erreur lors de la création de l\'audio : ', error);

    let errorMessage = 'Erreur lors de la création de l\'audio.';

    if (typeof error === 'string') {
      errorMessage = error;
    }

    res.status(500).json({ error: errorMessage });
  }
}

module.exports = createAudio;

// const Audio = require('../../models/AudioModel');
// const { uploadToS3 } = require('../../config/aws-config');
// const mm = require('music-metadata');
// const createArtiste = require('../../routes/ArtistesRoutes');

// const processAndUploadAudio = async (audioBuffer, tempAudioFilePath, name) => {
//   // Extraire le chemin du répertoire
//   const tempDir = tempAudioFilePath.replace(/\/[^\/]+$/, '');

//   // Créer le répertoire s'il n'existe pas
//   require('fs').mkdirSync(tempDir, { recursive: true });

//   // Convertir le buffer audio en fichier temporaire
//   require('fs').writeFileSync(tempAudioFilePath, audioBuffer);

//   // Extraction des métadonnées
//   const metadata = await mm.parseFile(tempAudioFilePath);

//   // Traitement des métadonnées
//   const title = metadata.common.title || 'Untitled';
//   // const artist = metadata.common.artist || 'Unknown Artist';
//   const duration = metadata.format.duration || '0:00';

//   // Supprimer le fichier temporaire
//   require('fs').unlinkSync(tempAudioFilePath);

//   // Appeler le contrôleur createArtiste pour créer l'artiste si nécessaire
//   const savedArtiste = await createArtiste({ name });

//   // Enregistrement dans MongoDB avec l'URL du fichier audio
//   const newAudio = new Audio({
//     title: title,
//     artistes: [savedArtiste._id],
//     albums: [], // À ajuster selon votre logique
//     duration: duration,
//     urlAudio: '', // À remplir après l'upload vers S3
//     // ... autres champs
//   });

//   // Mettre à jour le champ artistes avec l'ID de l'artiste créé
//   newAudio.artistes.push(savedArtiste._id);

//   const savedAudio = await newAudio.save();

//   // Ajouter le fichier audio à S3
//   const s3AudioUrl = await uploadToS3({
//     buffer: Buffer.from(audioBuffer),
//     originalname: `${title}.m4a`,
//   });

//   // Mettre à jour l'URL du fichier audio dans la base de données
//   savedAudio.urlAudio = s3AudioUrl;
//   await savedAudio.save();

//   return savedAudio;
// };

// async function createAudio(req, res) {
//   try {
//     let audioBuffer;
//     let tempAudioFilePath;

//     // Vérifier si le fichier audio est envoyé par createAlbum
//     if (req.file) {
//       audioBuffer = req.file.buffer;
//       tempAudioFilePath = `chemin-temporaire/${req.file.originalname}.mp3`;
//     } else {
//       // Si le fichier audio est créé indépendamment
//       audioBuffer = req.body.audioBuffer; // Ajoutez cette propriété dans la requête
//       tempAudioFilePath = `chemin-temporaire/indépendant.mp3`; // Nom de fichier temporaire générique
//     }

//     const savedAudio = await processAndUploadAudio(audioBuffer, tempAudioFilePath);

//     res.status(201).json(savedAudio);
//   } catch (error) {
//     console.error('Erreur lors de la création de l\'audio : ', error);
//     res.status(500).json({ error: 'Erreur lors de la création de l\'audio.' });
//   }
// }

// module.exports = createAudio;
