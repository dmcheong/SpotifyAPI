const Playlist = require('../../models/PlaylistModel');
const Audio = require('../../models/AudioModel');

async function deletePlaylist(req, res, next) {
  const playlistId = req.params.playlistId;

  try {
    // Retrouver la playlist à supprimer
    const playlist = await Playlist.findOne({ playlist_id: playlistId });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist introuvable.' });
    }

    // Supprimer les références dans les pistes audio
    const audioTracks = playlist.audio_tracks.map(track => track.track_id);
    await Audio.updateMany({ track_id: { $in: audioTracks } }, { $pull: { playlists: playlistId } });

    // Supprimer la playlist
    await Playlist.deleteOne({ playlist_id: playlistId });

    res.status(200).json({ message: 'Playlist supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la playlist : ', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la playlist.' });
  }
}

module.exports = deletePlaylist;
