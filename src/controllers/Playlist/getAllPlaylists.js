const Playlist = require('../../models/PlaylistModel');

async function getAllPlaylists(req, res, next) {
  try {
    const playlistList = await Playlist.find();
    res.status(200).json(playlistList);
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des playlists.' });
  }
}

module.exports = getAllPlaylists;
