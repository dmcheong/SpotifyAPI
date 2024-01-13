const Album = require('../../models/AlbumModel');

async function getAllAlbums(req, res, next) {
  try {
    // Récupérez tous les documents Album
    const allAlbums = await Album.find();

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs de chaque document
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').map(field => field.trim());
      const filteredAlbums = allAlbums.map(album => {
        return filteredFields.reduce((obj, field) => {
          obj[field] = album[field];
          return obj;
        }, {});
      });
      return res.status(200).json(filteredAlbums);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez tous les documents Album
    res.status(200).json(allAlbums);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les albums : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de tous les albums.' });
  }
}

module.exports = getAllAlbums;
