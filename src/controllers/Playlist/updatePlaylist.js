const Playlist = require('../../models/PlaylistModel');
const { uploadToS3, deleteFromS3 } = require('../../config/aws-config');

// Update - Mise à jour d'une playlist par ID
async function updatePlaylist(req, res) {
  const playlistId = req.params.id;
  const updatedData = req.body; // Données mises à jour

  try {
    // Récupération de la playlist existante
    const playlist = await Playlist.findById(playlistId);

    // Si un fichier audio est mis à jour, assurez-vous de mettre à jour également dans AWS S3
    if (req.file) {
      // Conversion en format .m4a (à adapter selon vos besoins)
      const tempAudioFilePath = `chemin-temporaire/${req.file.originalname}.m4a`;

      // (votre logique existante pour la conversion, l'upload, etc.)

      // Suppression de l'ancien fichier audio dans AWS S3 (si existant)
      if (playlist.urlAudio) {
        await deleteFromS3(playlist.urlAudio);
      }

      // Upload du nouveau fichier audio dans AWS S3
      const s3AudioUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempAudioFilePath)),
        originalname: `${req.file.originalname}.m4a`,
      });

      updatedData.urlAudio = s3AudioUrl;

      // Suppression du fichier audio temporaire
      require('fs').unlinkSync(tempAudioFilePath);
    }

    // Mise à jour des données dans MongoDB
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, updatedData, { new: true });

    // Retourne la playlist mise à jour en tant que réponse
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la playlist : ', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la playlist.' });
  }
}

module.exports = updatePlaylist;
