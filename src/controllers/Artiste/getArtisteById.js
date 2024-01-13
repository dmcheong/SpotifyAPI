const Artiste = require('../../models/ArtisteModel');

async function getArtisteById(req, res, next) {
  try {
    const artisteId = req.params.id;
    const artiste = await Artiste.findById(artisteId);

    if (!artiste) {
      return res.status(404).json({ error: 'Artiste non trouvé.' });
    }

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs en conséquence
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').reduce((obj, field) => {
        obj[field.trim()] = 1;
        return obj;
      }, {});
      const filteredArtiste = JSON.parse(JSON.stringify(artiste, Object.keys(filteredFields)));
      return res.status(200).json(filteredArtiste);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez l'artiste complet
    res.status(200).json(artiste);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artiste : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'artiste.' });
  }
}

module.exports = getArtisteById;
