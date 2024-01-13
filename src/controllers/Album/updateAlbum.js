const Album = require('../../models/AlbumModel');
const { uploadToS3, deleteFromS3 } = require('../../config/aws-config');
const ffmpeg = require('fluent-ffmpeg');

// Update - Mise à jour d'un album par ID
async function updateAlbum(req, res) {
  const albumId = req.params.id;
  const updatedData = req.body; // Données mises à jour

  try {
    // Récupération de l'album existant
    const album = await Album.findById(albumId);

    // Si le fichier audio est mis à jour, assurez-vous de mettre à jour également dans AWS S3
    if (req.file) {
      // Conversion en format .m4a
      const tempAudioFilePath = `chemin-temporaire/${req.file.originalname}.m4a`;

      await convertToM4a(req.file.buffer, tempAudioFilePath);

      // Suppression de l'ancien fichier audio dans AWS S3
      await deleteFromS3(album.urlAudio);

      // Upload du nouveau fichier audio dans AWS S3
      const s3AudioUrl = await uploadAudioToS3(req.file.buffer, req.file.originalname);

      // Mise à jour de l'URL audio dans les données mises à jour
      updatedData.urlAudio = s3AudioUrl;

      // Suppression du fichier audio temporaire
      deleteTempFile(tempAudioFilePath);
    }

    // Mise à jour des autres données dans MongoDB
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, updatedData, { new: true });

    // Retourne l'album mis à jour en tant que réponse
    res.status(200).json(updatedAlbum);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'album.' });
  }
}

// Fonction utilitaire pour convertir en format .m4a
async function convertToM4a(inputBuffer, outputFilePath) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputBuffer)
      .audioCodec('aac')
      .toFormat('m4a')
      .on('end', resolve)
      .on('error', reject)
      .save(outputFilePath);
  });
}

// Fonction utilitaire pour uploader l'audio vers AWS S3
async function uploadAudioToS3(audioBuffer, originalname) {
  return await uploadToS3({
    buffer: Buffer.from(audioBuffer),
    originalname: `${originalname}.m4a`,
  });
}

// Fonction utilitaire pour supprimer le fichier temporaire
function deleteTempFile(filePath) {
  require('fs').unlinkSync(filePath);
}

module.exports = updateAlbum;
