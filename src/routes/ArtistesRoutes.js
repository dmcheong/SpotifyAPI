const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les artistes
const getAllArtistes = require('../controllers/Artiste/getAllArtistes');
const getArtisteById = require('../controllers/Artiste/getArtisteById');
const createArtiste = require('../controllers/Artiste/createArtiste');
const updateArtiste = require('../controllers/Artiste/updateArtiste');
const deleteArtiste = require('../controllers/Artiste/deleteArtiste');

// Routes pour les artistes
router.get('/artistes', getAllArtistes);
router.get('/artistes/:id', getArtisteById);
router.post('/artistes', createArtiste);
router.put('/artistes/:id', updateArtiste);
router.delete('/artistes/:id', deleteArtiste);

module.exports = router;