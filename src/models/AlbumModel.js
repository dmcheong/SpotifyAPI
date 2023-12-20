const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  album_id: String,
  title: String,
  artist: String,
  cover_url: String,
  tracks: [
    {
      track_id: String,
      title: String,
      duration: String,
      // Autres métadonnées de piste
    }
    // ... d'autres pistes
  ]
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
