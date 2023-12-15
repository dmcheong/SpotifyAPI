const Album = require('../../models/AlbumModel');

// Read - Récupération d'un album par ID
async function getAlbumById(req, res) {
  const albumId = req.params.id;
  try {
    const album = await Album.findById(albumId);
    res.status(200).json(album);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'album.' });
  }
}

module.exports = getAlbumById;