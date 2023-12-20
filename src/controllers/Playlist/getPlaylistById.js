const Playlist = require('../../models/PlaylistModel');

async function getPlaylistById(req, res, next) {
  try {
    const playlistId = req.params.id;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist non trouvée.' });
    }

    res.status(200).json(playlist);
  } catch (error) {
    console.error('Erreur lors de la récupération de la playlist : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la playlist.' });
  }
}

module.exports = getPlaylistById;
