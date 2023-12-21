const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  playlist_id: String,
  title: String,
  creator: String,
  description: String,
  audio_tracks: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'Audio'
    }
    // ... d'autres pistes
  ]
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
