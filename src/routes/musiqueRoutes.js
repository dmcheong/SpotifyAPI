// musiqueRoutes.js
const express = require('express');
const router = express.Router();

const createController = require('../controllers/create');
const readController = require('../controllers/readOne');
const updateController = require('../controllers/update');
const deleteController = require('../controllers/delete');
const listController = require('../controllers/readAll');

// Créer une nouvelle musique
router.post('/musiques', createController.createMusique);

// Obtenir toutes les musiques
router.get('/musiques', listController.getAllMusiques);

// Obtenir une musique par son ID
router.get('/musiques/:id', readController.getMusiqueById);

// Mettre à jour une musique
router.patch('/musiques/:id', updateController.updateMusique);

// Supprimer une musique
router.delete('/musiques/:id', deleteController.deleteMusique);

module.exports = router;
