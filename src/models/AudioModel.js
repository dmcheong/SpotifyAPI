const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  urlAudio: String,
  title: String,
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste'
  },
  cover_url: String,
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  duration: String,
  // Autres métadonnées audio
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
