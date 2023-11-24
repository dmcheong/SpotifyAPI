const Album = require('../models/albumModel');

const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    res.json(album);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = getAlbumById;