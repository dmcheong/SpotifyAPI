const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  album_id: String,
  title: String,
  artist: String,
  date_sortie: String,
  cover_url: String,
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'Audio'
    }
    // ... d'autres pistes
  ]
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
