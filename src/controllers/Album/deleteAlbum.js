const Album = require('../../models/AlbumModel');
const Audio = require('../../models/AudioModel');
const { deleteFromS3 } = require('../../config/aws-config');

async function deleteAlbum(req, res, next) {
  try {
    const albumId = req.params.id; // Récupère l'ID de l'album à supprimer depuis les paramètres de la requête

    // Recherche l'album dans la base de données
    const album = await Album.findById(albumId);

    // Vérifie si l'album existe
    if (!album) {
      return res.status(404).json({ error: 'Album non trouvé' });
    }

    // Supprime les pistes audio associées à l'album
    await Audio.deleteMany({ album: albumId });

    // Supprime les fichiers audio du bucket S3
    for (const audio of album.tracks) {
      await deleteFromS3(audio.urlAudio);
    }

    // Supprime l'album de la base de données
    await Album.findByIdAndDelete(albumId);

    res.status(204).send(); // Renvoie une réponse sans contenu en cas de succès
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'album.' });
  }
}

module.exports = deleteAlbum;
