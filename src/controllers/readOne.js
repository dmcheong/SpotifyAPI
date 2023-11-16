// musiqueController.js
const Musique = require('../models/musique');

// Obtenir une musique par son ID
exports.getMusiqueById = async (req, res) => {
    try {
      const musique = await Musique.findById(req.params.id);
      if (musique) {
        res.json(musique);
      } else {
        res.status(404).json({ message: 'Musique non trouvée' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};