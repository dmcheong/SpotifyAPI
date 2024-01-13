const Audio = require('../../models/AudioModel');
const Playlist = require('../../models/AlbumModel');
const Artiste = require('../../models/ArtisteModel');
const { deleteFromS3 } = require('../../config/aws-config');

async function deleteAudio(req, res, next) {
  try {
    const audioId = req.params.id;

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
        album.audios = album.audios.filter(a => a.toString() !== audioId);
        await album.save();
      }
    }

    // Retirer l'audio des albums associés à l'artiste (s'il est associé à des albums)
    const artist = await Artiste.findOne({ audios: audioId });
    if (artist) {
      artist.audios = artist.audios.filter(a => a.toString() !== audioId);
      await artist.save();
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
