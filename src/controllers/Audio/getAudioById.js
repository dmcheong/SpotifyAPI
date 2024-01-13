const Audio = require('../../models/AudioModel');

async function getAudioById(req, res, next) {
  try {
    const audioId = req.params.id;
    const audio = await Audio.findById(audioId);

    if (!audio) {
      return res.status(404).json({ error: 'Audio non trouvé.' });
    }

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs en conséquence
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').reduce((obj, field) => {
        obj[field.trim()] = 1;
        return obj;
      }, {});
      const filteredAudio = JSON.parse(JSON.stringify(audio, Object.keys(filteredFields)));
      return res.status(200).json(filteredAudio);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez l'audio complet
    res.status  (200).json(audio);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'audio.' });
  }
}

module.exports = getAudioById;
