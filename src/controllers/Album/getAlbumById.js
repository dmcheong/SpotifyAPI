const Album = require('../../models/AlbumModel');

const getAlbumById = async (req, res, next) => {
  try {
    const albumId = req.params.id;

    // Récupérez l'album en fonction de l'ID
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ error: 'Album non trouvé.' });
    }

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs en conséquence
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').reduce((obj, field) => {
        obj[field.trim()] = 1;
        return obj;
      }, {});
      const filteredAlbum = JSON.parse(JSON.stringify(album, Object.keys(filteredFields)));
      return res.status(200).json(filteredAlbum);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez l'album complet
    res.status(200).json(album);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'album.' });
  }
};

module.exports = getAlbumById;
