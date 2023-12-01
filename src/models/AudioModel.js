const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  artiste: { type: mongoose.Schema.Types.ObjectId, ref: 'Artiste', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  duree: { type: Number, required: true }
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
