const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  playlist_id: String,
  title: String,
  creator: String,
  description: String,
  audio_tracks: [
    {
      track_id: String,
      title: String,
      artist: String,
      // Autres métadonnées de piste
    }
    // ... d'autres pistes
  ]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
