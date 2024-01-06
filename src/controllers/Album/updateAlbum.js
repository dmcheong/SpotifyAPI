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

      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(req.file.buffer)
          .audioCodec('aac')
          .toFormat('m4a')
          .on('end', resolve)
          .on('error', reject)
          .save(tempAudioFilePath);
      });

      // Suppression de l'ancien fichier audio dans AWS S3
      await deleteFromS3(album.urlAudio);

      // Upload du nouveau fichier audio dans AWS S3
      const s3AudioUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempAudioFilePath)),
        originalname: `${req.file.originalname}.m4a`,
      });

      // Mise à jour de l'URL audio dans les données mises à jour
      updatedData.urlAudio = s3AudioUrl;

      // Suppression du fichier audio temporaire
      require('fs').unlinkSync(tempAudioFilePath);
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

module.exports = updateAlbum;

