const Audio = require('../../models/AudioModel');
const { uploadToS3 } = require('../../config/aws-config');
const mm = require('music-metadata');
const { promisify } = require('util');

const processAndUploadAudio = async (audioBuffer, tempAudioFilePath, audio) => {
  // Convertir le buffer audio en fichier temporaire
  require('fs').writeFileSync(tempAudioFilePath, audioBuffer);

  // Extraction des métadonnées
  const metadata = await promisify(mm.parseFile)(tempAudioFilePath);

  // Traitement des métadonnées, par exemple :
  const title = metadata.common.title || 'Untitled';
  const artist = metadata.common.artist || 'Unknown Artist';
  const duration = metadata.format.duration || '0:00';

  // Supprimer le fichier temporaire
  require('fs').unlinkSync(tempAudioFilePath);

  // Enregistrement dans MongoDB avec l'URL du fichier audio
  const newAudio = new Audio({
    title: title,
    artistes: [artist],
    albums: [], // À ajuster selon votre logique
    duration: duration,
    urlAudio: '', // À remplir après l'upload vers S3
    // ... autres champs
  });

  const savedAudio = await newAudio.save();

  // Ajouter le fichier audio à S3
  const s3AudioUrl = await uploadToS3({
    buffer: Buffer.from(audioBuffer),
    originalname: `${title}.m4a`,
  });

  // Mettre à jour l'URL du fichier audio dans la base de données
  savedAudio.urlAudio = s3AudioUrl;
  await savedAudio.save();

  return savedAudio;
};

async function createAudio(req, res) {
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

    const savedAudio = await processAndUploadAudio(audioBuffer, tempAudioFilePath);

    res.status(201).json(savedAudio);
  } catch (error) {
    console.error('Erreur lors de la création de l\'audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'audio.' });
  }
}

module.exports = createAudio;
