const Artiste = require('../../models/ArtisteModel');

async function createArtiste(req, res, next) {
  try {

    // Enregistrement dans MongoDB avec l'URL de la couverture
    const newArtiste = new Artiste({
      name: req.body.name, 
      artist: req.body.name, 
      albums: [], // Initialement, aucun album associé
      audio: [], // Initialement, aucun fichier audio associé
      // ... autres champs
    });

    const savedArtiste = await newArtiste.save();
    res.status(201).json(savedArtiste);
  } catch (error) {
    console.error('Erreur lors de la création de l\'artiste : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'artiste.', details: error.message });
  }
}

module.exports = createArtiste;
