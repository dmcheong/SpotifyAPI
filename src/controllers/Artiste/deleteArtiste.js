const Artiste = require('../models/artisteModel');

const deleteArtiste = async (req, res) => {
  try {
    await Artiste.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artiste deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = deleteArtiste;