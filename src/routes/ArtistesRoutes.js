const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

// Importation des contrôleurs pour les artistes
const getAllArtistes = require('../controllers/Artiste/getAllArtistes');
const getArtisteById = require('../controllers/Artiste/getArtisteById');
const createArtiste = require('../controllers/Artiste/createArtiste');
const updateArtiste = require('../controllers/Artiste/updateArtiste');
const deleteArtiste = require('../controllers/Artiste/deleteArtiste');

// Routes pour les artistes
router.get('/', getAllArtistes);
router.get('/:id', getArtisteById);
router.post('/', upload.none(), createArtiste);
router.put('/:id', updateArtiste);
router.delete('/:id', deleteArtiste);

module.exports = router;
