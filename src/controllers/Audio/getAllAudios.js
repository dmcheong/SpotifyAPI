const Audio = require('../../models/AudioModel');

async function getAllAudio(req, res, next) {
  try {
    // Récupérez tous les documents Audio
    const allAudio = await Audio.find();

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs de chaque document
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').map(field => field.trim());
      const filteredAudio = allAudio.map(audio => {
        return filteredFields.reduce((obj, field) => {
          obj[field] = audio[field];
          return obj;
        }, {});
      });
      return res.status(200).json(filteredAudio);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez tous les documents Audio
    res.status(200).json(allAudio);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les audios : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de tous les audios.' });
  }
}

module.exports = getAllAudio;
