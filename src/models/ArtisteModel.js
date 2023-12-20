const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  artist_id: String,
  name: String,
  albums: [String],
  audio: [String],
  // Autres métadonnées artiste
});

const Artiste = mongoose.model('Artiste', artisteSchema);

module.exports = Artiste;
