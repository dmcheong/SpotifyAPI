const Audio = require('../../models/AudioModel');
const Playlist = require('../../models/AlbumModel');
const Artiste = require('../../models/ArtisteModel');
const { deleteFromS3 } = require('../../config/aws-config');

async function deleteAudio(req, res, next) {
  try {
    const audioId = req.params.id; // Récupère l'ID de l'audio à supprimer depuis les paramètres de la requête

    // Recherche l'audio dans la base de données
    const audio = await Audio.findById(audioId);

    // Vérifie si l'audio existe
    if (!audio) {
      return res.status(404).json({ error: 'Audio non trouvé' });
    }

    // Retirer l'audio de l'album associé (s'il est associé à un album)
    if (audio.album) {
      const album = await Album.findById(audio.album);
      if (album) {
        const index = album.tracks.indexOf(audioId);
        if (index !== -1) {
          album.tracks.splice(index, 1);
          await album.save();
        }
      }
    }

    // Retirer l'audio des albums associés à l'artiste (s'il est associé à des albums)
    const artist = await Artiste.findOne({ audio: audioId });
    if (artist) {
      const index = artist.audio.indexOf(audioId);
      if (index !== -1) {
        artist.audio.splice(index, 1);
        await artist.save();
      }
    }

    // Supprimer l'audio de toutes les playlists associées (s'il est associé à des playlists)
    const playlists = await Playlist.find({ 'audio_groups.audio_tracks.track_id': audioId });
    for (const playlist of playlists) {
      for (const group of playlist.audio_groups) {
        const index = group.audio_tracks.findIndex(track => track.track_id === audioId);
        if (index !== -1) {
          group.audio_tracks.splice(index, 1);
        }
      }
      await playlist.save();
    }

    // Supprimer le fichier audio du bucket S3
    await deleteFromS3(audio.urlAudio);

    // Supprimer l'audio de la base de données
    await Audio.findByIdAndDelete(audioId);

    res.status(204).send(); // Renvoie une réponse sans contenu en cas de succès
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'audio.' });
  }
}

module.exports = deleteAudio;
