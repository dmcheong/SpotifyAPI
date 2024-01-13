const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configurer le stockage avec Multer
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Importation des contrôleurs pour les audios
const getAllAudios = require('../controllers/Audio/getAllAudios');
const getAudioById = require('../controllers/Audio/getAudioById');
const createAudio = require('../controllers/Audio/createAudio');
const updateAudio = require('../controllers/Audio/updateAudio');
const deleteAudio = require('../controllers/Audio/deleteAudio');

// Routes pour les audios
router.get('/', getAllAudios);
router.get('/:id', getAudioById);
// Définir les routes avec Multer middleware
router.post('/', upload.single('file'), createAudio);
router.put('/:id', updateAudio);
router.delete('/:id', deleteAudio);

module.exports = router;