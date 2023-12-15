const Album = require('../models/albumModel');
const { uploadToS3, deleteFromS3 } = require('./aws-functions'); // Ajoutez vos fonctions d'upload et de suppression vers AWS S3 ici

// Delete - Suppression d'un album par ID
async function deleteAlbum(req, res) {
  const albumId = req.params.id;
  try {
    const album = await Album.findById(albumId);

    // Suppression du fichier audio dans AWS S3
    await deleteFromS3(album.urlAudio);

    await Album.findByIdAndDelete(albumId);
    res.status(204).send(); // Pas de contenu en réponse
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'album.' });
  }
}

module.exports = deleteAlbum;