const Artiste = require('../../models/ArtisteModel');
const multer = require('multer');
const upload = multer();

async function createArtiste(req, res, next) {
  try {
    // Affiche les données du formulaire
    console.log(req.body);

    // Validation des données d'entrée
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Le champ "name" est obligatoire.' });
    }

    // Enregistrement dans MongoDB avec l'URL de la couverture
    const savedArtiste = await Artiste.create({
      name: name,
      albums: [],
      audios: [],
    });

    res.status(201).json(savedArtiste);
  } catch (error) {
    console.error('Erreur lors de la création de l\'artiste : ', error);
    next(error);
  }
}

module.exports = upload.none(), createArtiste;
