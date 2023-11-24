const Artiste = require('../models/artisteModel');

const updateArtiste = async (req, res) => {
  try {
    const updatedArtiste = await Artiste.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedArtiste);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = updateArtiste;