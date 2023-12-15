const Artiste = require('../../models/ArtisteModel');

const getArtisteById = async (req, res) => {
  try {
    const artiste = await Artiste.findById(req.params.id);
    res.json(artiste);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = getArtisteById;