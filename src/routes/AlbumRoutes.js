const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les albums
const getAllAlbums = require('./Controllers/Album/getAllAlbums');
const getAlbumById = require('./Controllers/Album/getAlbumById');
const createAlbum = require('./Controllers/Album/createAlbum');
const updateAlbum = require('./Controllers/Album/updateAlbum');
const deleteAlbum = require('./Controllers/Album/deleteAlbum');

// Routes pour les albums
app.get('/albums', getAllAlbums);
app.get('/albums/:id', getAlbumById);
app.post('/albums', createAlbum);
app.put('/albums/:id', updateAlbum);
app.delete('/albums/:id', deleteAlbum);

module.exports = router;