const Artiste = require('../../models/ArtisteModel');
const { uploadToS3, deleteFromS3 } = require('../../config/aws-config');

// Update - Mise à jour d'un artiste par ID
async function updateArtiste(req, res) {
  const artisteId = req.params.id;
  const updatedData = req.body; // Données mises à jour

  try {
    // Récupération de l'artiste existant
    const artiste = await Artiste.findById(artisteId);

    // Si une couverture est mise à jour, assurez-vous de mettre à jour également dans AWS S3
    if (req.file) {
      // Suppression de l'ancienne couverture dans AWS S3 (si elle existe)
      if (artiste.cover_url) {
        await deleteFromS3(artiste.cover_url);
      }

      // Upload de la nouvelle couverture dans AWS S3
      const s3CoverUrl = await uploadToS3({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
      });

      updatedData.cover_url = s3CoverUrl;
    }

    // Mise à jour des données dans MongoDB
    const updatedArtiste = await Artiste.findByIdAndUpdate(artisteId, updatedData, { new: true });

    // Retourne l'artiste mis à jour en tant que réponse
    res.status(200).json(updatedArtiste);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'artiste : ', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'artiste.' });
  }
}

module.exports = updateArtiste;
