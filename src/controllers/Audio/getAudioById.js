const Audio = require('../../models/AudioModel');

async function getAudioById(req, res, next) {
  try {
    const audioId = req.params.id;
    const audio = await Audio.findById(audioId);

    if (!audio) {
      return res.status(404).json({ error: 'Piste audio non trouvée.' });
    }

    res.status(200).json(audio);
  } catch (error) {
    console.error('Erreur lors de la récupération de la piste audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la piste audio.' });
  }
}

module.exports = getAudioById;
