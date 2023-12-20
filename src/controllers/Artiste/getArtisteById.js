const Artiste = require('../../models/ArtisteModel');

async function getArtisteById(req, res, next) {
  try {
    const artisteId = req.params.id;
    const artiste = await Artiste.findById(artisteId);

    if (!artiste) {
      return res.status(404).json({ error: 'Artiste non trouvé.' });
    }

    res.status(200).json(artiste);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artiste : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'artiste.' });
  }
}

module.exports = getArtisteById;
