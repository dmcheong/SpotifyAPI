// musiqueController.js
const Musique = require('../models/musique');

// Mettre à jour une musique
exports.updateMusique = async (req, res) => {
    try {
      const musique = await Musique.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (musique) {
        res.json(musique);
      } else {
        res.status(404).json({ message: 'Musique non trouvée' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};