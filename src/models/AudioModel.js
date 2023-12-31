const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  urlAudio: String,
  title: String,
  artist: String,
  cover_url: String,
  album: {
    type: String,
  },
  duration: String,
  // Autres métadonnées audio
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
