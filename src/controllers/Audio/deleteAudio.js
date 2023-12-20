const Audio = require('../../models/AudioModel');
const { deleteFromS3 } = require('../../config/aws-config');
const Playlist = require('../../models/PlaylistModel');

async function deleteAudio(req, res, next) {
  try {
    const audioId = req.params.id; // Récupère l'ID de l'audio à supprimer depuis les paramètres de la requête

    // Recherche l'audio dans la base de données
    const audio = await Audio.findById(audioId);

    // Vérifie si l'audio existe
    if (!audio) {
      return res.status(404).json({ error: 'Audio non trouvé' });
    }

    // Supprime l'audio de l'album associé (s'il est associé à un album)
    if (audio.album) {
      await Audio.deleteMany({ album: audio.album });
    }

    // Supprime l'audio de toutes les playlists associées (s'il est associé à des playlists)
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

    // Supprime le fichier audio du bucket S3
    await deleteFromS3(audio.urlAudio);

    // Supprime l'audio de la base de données
    await Audio.findByIdAndDelete(audioId);

    res.status(204).send(); // Renvoie une réponse sans contenu en cas de succès
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'audio : ', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'audio.' });
  }
}

module.exports = deleteAudio;
