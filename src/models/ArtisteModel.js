const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  pays: { type: String },
  genre: { type: String },
  membres: [{ type: String }], // Si un groupe a plusieurs membres
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }], // Référence aux albums liés
  // Ajoutez d'autres champs si nécessaire
});

const Artiste = mongoose.model('Artiste', artisteSchema);

module.exports = Artiste;
