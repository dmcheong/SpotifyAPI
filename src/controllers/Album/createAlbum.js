const { uploadToS3 } = require('../../config/aws-config');
const Album = require('../../models/AlbumModel');
const Audio = require('../../models/AudioModel');

async function createAlbum(req, res, next) {
  try {
    const { title, artist } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Le titre et l\'artiste sont obligatoires.' });
    }

    const newAlbum = new Album({
      title: title,
      artist: artist,
      date_sortie: req.body.date_sortie || '',
      // ... autres champs
    });

    // Ajouter la couverture si elle est présente dans la requête
    if (req.file) {
      const s3CoverUrl = await uploadCoverToS3(req.file);
      newAlbum.cover_url = s3CoverUrl || '';
    }

    // Ajouter les pistes audio si elles sont présentes dans la requête
    if (req.body.tracks && req.body.tracks.length > 0) {
      const audioDocuments = req.body.tracks.map((track, index) => {
        return new Audio({
          urlAudio: track.urlAudio || '',
          title: track.title || '',
          artist: track.artist || '',
          cover_url: track.cover_url || '',
          album: newAlbum._id, // Référence à l'album en cours de création
          duration: track.duration || '',
          // ... autres champs audio
        });
      });

      const savedAudio = await Audio.insertMany(audioDocuments);
      newAlbum.tracks = savedAudio.map(audio => audio._id);
    }

    const savedAlbum = await newAlbum.save();
    res.status(201).json(savedAlbum);
  } catch (error) {
    console.error('Erreur lors de la création de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'album.', details: error.message });
  }
}

module.exports = createAlbum;

