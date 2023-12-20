const Audio = require('../../models/AudioModel');
const { uploadToS3, deleteFromS3 } = require('../../config/aws-config');

// Update - Mise à jour d'un fichier audio par ID
async function updateAudio(req, res) {
  const audioId = req.params.id;
  const updatedData = req.body; // Données mises à jour

  try {
    // Récupération de l'audio existant
    const audio = await Audio.findById(audioId);

    // Si une couverture est mise à jour, assurez-vous de mettre à jour également dans AWS S3
    if (req.file) {
      // Conversion en format image (à adapter selon vos besoins)
      const tempCoverFilePath = `chemin-temporaire/cover-${req.file.originalname}.jpg`;

      // (votre logique existante pour la conversion, l'upload, etc.)

      // Suppression de l'ancienne couverture dans AWS S3 (si existante)
      if (audio.urlCover) {
        await deleteFromS3(audio.urlCover);
      }

      // Upload de la nouvelle couverture dans AWS S3
      const s3CoverUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempCoverFilePath)),
        originalname: `cover-${req.file.originalname}.jpg`,
      });

      updatedData.urlCover = s3CoverUrl;

      // Suppression du fichier de couverture temporaire
      require('fs').unlinkSync(tempCoverFilePath);
    }

    // Mise à jour des données dans MongoDB
    const updatedAudio = await Audio.findByIdAndUpdate(audioId, updatedData, { new: true });

    // Retourne l'audio mis à jour en tant que réponse
    res.status(200).json(updatedAudio);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'audio.' });
  }
}

module.exports = updateAudio;
