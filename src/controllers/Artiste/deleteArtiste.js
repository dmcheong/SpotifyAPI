const Artiste = require('../../models/ArtisteModel');
const { deleteObjectFromS3 } = require('../../config/aws-config');

const deleteArtiste = async (req, res) => {
  try {
    const artisteId = req.params.id;

    // Suppression de l'artiste dans la base de données
    const deletedArtiste = await Artiste.findByIdAndDelete(artisteId);

    // Suppression du fichier multimédia lié dans le bucket S3
    await deleteObjectFromS3(deletedArtiste.mediaKey); // Assurez-vous d'avoir une clé appropriée dans votre modèle d'artiste

    res.json({ message: 'Artiste deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = deleteArtiste;