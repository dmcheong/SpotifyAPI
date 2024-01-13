const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  name: String,
  first_name: String,
  last_name: String,
  full_name: String,
  cover_url: String,
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album'
    }
    // ... d'autres albums
  ],
  audios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Audio'
    }
    // ... d'autres pistes audio
  ],
  // Autres métadonnées artiste
});

const Artiste = mongoose.model('Artiste', artisteSchema);

module.exports = Artiste;
