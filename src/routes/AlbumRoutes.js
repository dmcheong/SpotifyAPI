const express = require('express');
const multer = require('multer');
const router = express.Router();

// Importation des contrôleurs pour les albums
const getAllAlbums = require('../controllers/Album/getAllAlbums');
const getAlbumById = require('../controllers/Album/getAlbumById');
const createAlbum = require('../controllers/Album/createAlbum');
const updateAlbum = require('../controllers/Album/updateAlbum');
const deleteAlbum = require('../controllers/Album/deleteAlbum');

// Routes pour les albums
router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

module.exports = router;