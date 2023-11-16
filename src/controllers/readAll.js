// musiqueController.js
const Musique = require('../models/musique');

// Obtenir toutes les musiques
exports.getAllMusiques = async (req, res) => {
    try {
      const musiques = await Musique.find();
      res.json(musiques);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};