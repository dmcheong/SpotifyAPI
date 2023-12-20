const Album = require('../../models/AlbumModel');

async function getAlbumById(req, res, next) {
  try {
    const albumId = req.params.id;
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ error: 'Album non trouvé.' });
    }

    res.status(200).json(album);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'album.' });
  }
}

module.exports = getAlbumById;
