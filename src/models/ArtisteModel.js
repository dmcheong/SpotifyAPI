const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  name: String,
  cover_url: String,
  albums: [String],
  audio: [String],
  // Autres métadonnées artiste
});

const Artiste = mongoose.model('Artiste', artisteSchema);

module.exports = Artiste;
