// musiqueController.js
const Musique = require('../models/musique');

// Créer une nouvelle musique
exports.createMusique = async (req, res) => {
    try {
      const nouvelleMusique = new Musique(req.body);
      const musiqueEnregistree = await nouvelleMusique.save();
      res.status(201).json(musiqueEnregistree);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};