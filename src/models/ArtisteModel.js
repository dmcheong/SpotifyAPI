const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
});

const Artiste = mongoose.model('Artiste', artisteSchema);

module.exports = Artiste;
