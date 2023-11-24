const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les artistes
const getAllArtistes = require('./Controllers/Artiste/getAllArtistes');
const getArtisteById = require('./Controllers/Artiste/getArtisteById');
const createArtiste = require('./Controllers/Artiste/createArtiste');
const updateArtiste = require('./Controllers/Artiste/updateArtiste');
const deleteArtiste = require('./Controllers/Artiste/deleteArtiste');

// Routes pour les artistes
app.get('/artistes', getAllArtistes);
app.get('/artistes/:id', getArtisteById);
app.post('/artistes', createArtiste);
app.put('/artistes/:id', updateArtiste);
app.delete('/artistes/:id', deleteArtiste);

module.exports = router;