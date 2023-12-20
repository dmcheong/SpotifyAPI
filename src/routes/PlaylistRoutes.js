const express = require('express');
const router = express.Router();

// Importation des contrôleurs pour les Playlists
const getAllPlaylists = require('../controllers/Playlist/getAllPlaylists');
const getPlaylistById = require('../controllers/Playlist/getPlaylistById');
const createPlaylist = require('../controllers/Playlist/createPlaylist');
const updatePlaylist = require('../controllers/Playlist/updatePlaylist');
const deletePlaylist = require('../controllers/Playlist/deletePlaylist');

// Routes pour les Playlists
router.get('/playlists', getAllPlaylists);
router.get('/playlists/:id', getPlaylistById);
router.post('/playlists', createPlaylist);
router.put('/playlists/:id', updatePlaylist);
router.delete('/playlists/:id', deletePlaylist);

module.exports = router;