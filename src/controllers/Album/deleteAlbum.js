const Album = require('../../models/AlbumModel');
const Audio = require('../../models/AudioModel');
const Artiste = require('../../models/ArtisteModel');
// const { deleteFromS3 } = require('../../utils/s3Utils');

async function deleteAlbum(req, res, next) {
  try {
    const albumId = req.params.id;

    // Recherche l'album dans la base de données
    const album = await Album.findById(albumId);

    // Vérifie si l'album existe
    if (!album) {
      return res.status(404).json({ error: 'Album non trouvé' });
    }

    // Supprime les pistes audio associées à l'album
    await Audio.deleteMany({ albums: albumId });

    // Supprime les fichiers audio du bucket S3
    for (const audio of album.audios) {
      await deleteFromS3(audio.urlAudio);
    }

    // Retire l'ID de l'album de la liste des albums de l'artiste
    for (const artistId of album.artistes) {
      const artiste = await Artiste.findById(artistId);
      if (artiste) {
        const index = artiste.albums.indexOf(albumId);
        if (index !== -1) {
          artiste.albums.splice(index, 1);
          await artiste.save();
        }
      }
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
