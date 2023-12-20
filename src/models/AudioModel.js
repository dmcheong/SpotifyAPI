const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  audio_id: String,
  title: String,
  artist: String,
  album: {
    type: String,
    required: true,
  },
  duration: String,
  // Autres métadonnées audio
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
