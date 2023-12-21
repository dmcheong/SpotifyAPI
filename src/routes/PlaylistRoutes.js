const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les Playlists
const getAllPlaylists = require('../controllers/Playlist/getAllPlaylists');
const getPlaylistById = require('../controllers/Playlist/getPlaylistById');
const createPlaylist = require('../controllers/Playlist/createPlaylist');
const updatePlaylist = require('../controllers/Playlist/updatePlaylist');
const deletePlaylist = require('../controllers/Playlist/deletePlaylist');

// Routes pour les Playlist
router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', createPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

module.exports = router;