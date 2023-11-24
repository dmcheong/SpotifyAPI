const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les audios
const getAllAudios = require('./Controllers/Audio/getAllAudios');
const getAudioById = require('./Controllers/Audio/getAudioById');
const createAudio = require('./Controllers/Audio/createAudio');
const updateAudio = require('./Controllers/Audio/updateAudio');
const deleteAudio = require('./Controllers/Audio/deleteAudio');

// Routes pour les audios
app.get('/audios', getAllAudios);
app.get('/audios/:id', getAudioById);
app.post('/audios', createAudio);
app.put('/audios/:id', updateAudio);
app.delete('/audios/:id', deleteAudio);

module.exports = router;