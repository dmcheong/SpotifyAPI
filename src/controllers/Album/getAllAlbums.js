const Album = require('../../models/AlbumModel');

async function getAllAlbums(req, res, next) {
  try {
    const albumList = await Album.find();
    res.status(200).json(albumList);
  } catch (error) {
    console.error('Erreur lors de la récupération des albums : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des albums.' });
  }
}

module.exports = getAllAlbums;
