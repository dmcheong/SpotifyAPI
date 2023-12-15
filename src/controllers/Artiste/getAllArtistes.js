const Artiste = require('../../models/ArtisteModel');

const getAllArtistes = async (req, res) => {
  try {
    const artistes = await Artiste.find();
    res.json(artistes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = getAllArtistes;