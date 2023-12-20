const Artiste = require('../../models/ArtisteModel');
const Album = require('../../models/AlbumModel');
const Audio = require('../../models/AudioModel');
const { deleteFromS3 } = require('../../config/aws-config');

async function deleteArtiste(req, res, next) {
  try {
    const artisteId = req.params.id; // Récupère l'ID de l'artiste à supprimer depuis les paramètres de la requête

    // Recherche l'artiste dans la base de données
    const artiste = await Artiste.findById(artisteId);

    // Vérifie si l'artiste existe
    if (!artiste) {
      return res.status(404).json({ error: 'Artiste non trouvé' });
    }

    // Supprime les albums associés à l'artiste
    await Album.deleteMany({ artiste: artisteId });

    // Supprime les pistes audio associées aux albums de l'artiste
    const albums = await Album.find({ artiste: artisteId });
    for (const album of albums) {
      await Audio.deleteMany({ album: album._id });
      // Supprime les fichiers audio du bucket S3
      for (const audio of album.tracks) {
        await deleteFromS3(audio.urlAudio);
      }
    }

    // Supprime l'artiste de la base de données
    await Artiste.findByIdAndDelete(artisteId);

    res.status(204).send(); // Renvoie une réponse sans contenu en cas de succès
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'artiste : ', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'artiste.' });
  }
}

module.exports = deleteArtiste;
