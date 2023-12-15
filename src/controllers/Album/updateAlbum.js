const Album = require('../../models/AlbumModel');
const { uploadToS3, deleteFromS3 } = require('../../config/aws-config');

// Update - Mise à jour d'un album par ID
async function updateAlbum(req, res) {
  const albumId = req.params.id;
  const updatedData = req.body; // Données mises à jour

  try {
    // Si le fichier audio est mis à jour, assurez-vous de mettre à jour également dans AWS S3
    if (req.file) {
      // (votre logique existante pour la conversion, l'upload, etc.)

      // Suppression de l'ancien fichier audio dans AWS S3
      await deleteFromS3(album.urlAudio);

      // Upload du nouveau fichier audio dans AWS S3
      const s3AudioUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempAudioFilePath)),
        originalname: `${file.originalname}.m4a`,
      });

      updatedData.urlAudio = s3AudioUrl;
    }

    const updatedAlbum = await Album.findByIdAndUpdate(albumId, updatedData, { new: true });
    res.status(200).json(updatedAlbum);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'album.' });
  }
}

module.exports = updateAlbum;