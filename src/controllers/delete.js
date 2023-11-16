// musiqueController.js
const Musique = require('../models/musique');

// Supprimer une musique
exports.deleteMusique = async (req, res) => {
    try {
      const musiqueSupprimee = await Musique.findByIdAndRemove(req.params.id);
      if (musiqueSupprimee) {
        res.json({ message: 'Musique supprimée avec succès' });
      } else {
        res.status(404).json({ message: 'Musique non trouvée' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};