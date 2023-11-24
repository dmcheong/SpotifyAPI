const Album = require('../models/albumModel');

const deleteAlbum = async (req, res) => {
    try {
      await Album.findByIdAndDelete(req.params.id);
      res.json({ message: 'Album deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = deleteAlbum;