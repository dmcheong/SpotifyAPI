const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les audios
const getAllAudios = require('../controllers/Audio/getAllAudios');
const getAudioById = require('../controllers/Audio/getAudioById');
const createAudio = require('../controllers/Audio/createAudio');
const updateAudio = require('../controllers/Audio/updateAudio');
const deleteAudio = require('../controllers/Audio/deleteAudio');

// Routes pour les audios
router.get('/audios', getAllAudios);
router.get('/audios/:id', getAudioById);
router.post('/audios', createAudio);
router.put('/audios/:id', updateAudio);
router.delete('/audios/:id', deleteAudio);

module.exports = router;