const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les albums
const getAllAlbums = require('../controllers/Album/getAllAlbums');
const getAlbumById = require('../controllers/Album/getAlbumById');
const createAlbum = require('../controllers/Album/createAlbum');
const updateAlbum = require('../controllers/Album/updateAlbum');
const deleteAlbum = require('../controllers/Album/deleteAlbum');

// Routes pour les albums
router.get('/albums', getAllAlbums);
router.get('/albums/:id', getAlbumById);
router.post('/albums', createAlbum);
router.put('/albums/:id', updateAlbum);
router.delete('/albums/:id', deleteAlbum);

module.exports = router;