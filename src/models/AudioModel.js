const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  title: String,
  artistes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste'
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  duration: String,
  urlAudio: String,
  // Autres métadonnées audio
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
