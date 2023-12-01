const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  artiste: { type: mongoose.Schema.Types.ObjectId, ref: 'Artiste', required: true },
  audios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Audio' }],
  dateSortie: { type: Date },
  urlAffichage: { type: String }, // L'URL pour l'affichage
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
