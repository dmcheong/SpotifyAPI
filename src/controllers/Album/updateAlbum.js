const Album = require('../models/albumModel');

const updateAlbum = async (req, res) => {
    try {
      const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedAlbum);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = updateAlbum;