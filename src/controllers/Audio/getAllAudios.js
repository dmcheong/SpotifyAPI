const Audio = require('../../models/AudioModel');

async function getAllAudio(req, res, next) {
  try {
    const audioList = await Audio.find();
    res.status(200).json(audioList);
  } catch (error) {
    console.error('Erreur lors de la récupération des pistes audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des pistes audio.' });
  }
}

module.exports = getAllAudio;
