const mongoose = require('mongoose');

const musiqueSchema = new mongoose.Schema({
  pochetteAlbum: { type: String, required: true },
  titre: { type: String, required: true },
  duree: { type: Number, required: true },
  auteur: { type: String, required: true },
  compositeur: { type: String },
  dateSortie: { type: Date },
  // Ajoutez d'autres champs si nécessaire
});

const Musique = mongoose.model('Musique', musiqueSchema);

module.exports = Musique;