const Artiste = require('../../models/ArtisteModel');

async function getAllArtistes(req, res, next) {
  try {
    const artisteList = await Artiste.find();
    res.status(200).json(artisteList);
  } catch (error) {
    console.error('Erreur lors de la récupération des artistes : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des artistes.' });
  }
}

module.exports = getAllArtistes;
