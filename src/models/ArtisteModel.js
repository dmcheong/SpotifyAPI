const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  name: String,
  first_name: String,
  last_name: String,
  full_name: String,
  cover_url: String,
  albums: 
  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  audios: 
  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audio'
  }],
});

const Artiste = mongoose.model('Artiste', artisteSchema);

module.exports = Artiste;
