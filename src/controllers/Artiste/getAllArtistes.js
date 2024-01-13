const Artiste = require('../../models/ArtisteModel');

async function getAllArtistes(req, res, next) {
  try {
    // Récupérez tous les documents Artiste
    const allArtistes = await Artiste.find();

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs de chaque document
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').map(field => field.trim());
      const filteredArtistes = allArtistes.map(artiste => {
        return filteredFields.reduce((obj, field) => {
          obj[field] = artiste[field];
          return obj;
        }, {});
      });
      return res.status(200).json(filteredArtistes);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez tous les documents Artiste
    res.status(200).json(allArtistes);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les artistes : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de tous les artistes.' });
  }
}

module.exports = getAllArtistes;
