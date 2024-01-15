const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: String,
  artistes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste'
  }],
  date_sortie: String,
  cover_url: String,
  audios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audio'
  }]
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
