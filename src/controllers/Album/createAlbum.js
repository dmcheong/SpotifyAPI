const Album = require('../../models/AlbumModel');
const Artiste = require('../../models/ArtisteModel');
const createAudio = require('../../routes/AudioRoutes');
const { uploadCoverToS3 } = require('../../config/aws-config');

async function createAlbum(req, res, next) {
  try {
    const { title, artist } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: 'Le titre et l\'artiste sont obligatoires.' });
    }

    // Vérifier si l'artiste existe déjà, sinon le créer
    let artiste = await Artiste.findOne({ name: artist });
    if (!artiste) {
      artiste = await Artiste.create({ name: artist });
    }

    // Créer l'album avec la référence à l'artiste
    const newAlbum = await Album.create({
      title: title,
      artistes: [artiste._id],
      date_sortie: req.body.date_sortie || '',
      // ... autres champs
    });

    // Ajouter la couverture si elle est présente dans la requête
    if (req.file) {
      const s3CoverUrl = await uploadCoverToS3(req.file);
      newAlbum.cover_url = s3CoverUrl || '';
      await newAlbum.save();
    }

    // Ajouter les pistes audio si elles sont présentes dans la requête
    if (req.body.tracks && req.body.tracks.length > 0) {
      const audioDocuments = req.body.tracks.map(async (track, index) => {
        const newAudio = await createAudio(track, req.file.buffer);
        newAudio.artistes = [artiste._id];
        newAudio.album = newAlbum._id;

        return newAudio.save();
      });

      const savedAudio = await Promise.all(audioDocuments);
      newAlbum.audios = savedAudio.map(audio => audio._id);
      await newAlbum.save();
    }

    res.status(201).json(newAlbum);
  } catch (error) {
    console.error('Erreur lors de la création de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'album.', details: error.message });
  }
}

module.exports = createAlbum;
