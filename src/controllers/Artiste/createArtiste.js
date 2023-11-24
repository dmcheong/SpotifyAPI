const Artiste = require('../models/artisteModel');

const createArtiste = async (req, res) => {
  try {
    const newArtiste = await Artiste.create(req.body);
    res.json(newArtiste);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = createArtiste;