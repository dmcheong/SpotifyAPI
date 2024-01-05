const { uploadToS3 } = require('../../config/aws-config');
const Album = require('../../models/AlbumModel');
const musicMetadata = require('music-metadata');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');

async function createAlbum(req, res, next) {
  try {
    const file = req.file;

    // Conversion en format .m4a
    const tempAudioFilePath = `chemin-temporaire/${file.originalname}.m4a`;

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(file.buffer)
        .audioCodec('aac')
        .toFormat('m4a')
        .on('end', resolve)
        .on('error', reject)
        .save(tempAudioFilePath);
    });

    // Upload du fichier audio dans S3
    const s3AudioUrl = await uploadToS3({
      buffer: Buffer.from(require('fs').readFileSync(tempAudioFilePath)),
      originalname: `${file.originalname}.m4a`,
    });

    // Suppression du fichier audio temporaire
    require('fs').unlinkSync(tempAudioFilePath);

    // Extraction des métadonnées du fichier audio converti
    const audioMetadata = await musicMetadata.parseFile(Buffer.from(require('fs').readFileSync(tempAudioFilePath)));

    // Upload de la couverture dans S3 si elle existe
    if (audioMetadata.common.picture && audioMetadata.common.picture.length > 0) {
      const coverImage = audioMetadata.common.picture[0];
      const tempCoverFilePath = `chemin-temporaire/cover-${file.originalname}.jpg`;

      // Sauvegarde de la couverture temporaire dans un fichier
      require('fs').writeFileSync(tempCoverFilePath, coverImage.data);

      // Upload de la couverture dans S3
      const s3CoverUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempCoverFilePath)),
        originalname: `cover-${file.originalname}.jpg`,
      });

      // Suppression du fichier de couverture temporaire
      require('fs').unlinkSync(tempCoverFilePath);

      function generateAlbumId() {
        // Générer un ID unique pour l'album (peut utiliser une bibliothèque comme uuid)
        return uuid.v4();
      }
      
      function generateTrackId() {
        // Générer un ID unique pour la piste (peut utiliser une bibliothèque comme uuid)
        return uuid.v4();
      }      

      // Enregistrement dans MongoDB avec l'URL de la couverture
      const newAlbum = new Album({
        album_id: generateAlbumId(), // Assure-toi d'avoir une fonction pour générer un ID unique
        title: req.body.albumTitle,
        artist: req.body.artist,
        cover_url: s3CoverUrl || '', // Utilise l'URL de la couverture s'il y en a une, sinon une chaîne vide
        tracks: [
          {
            track_id: generateTrackId(), // Assure-toi d'avoir une fonction pour générer un ID unique
            title: req.body.trackTitle,
            duration: req.body.trackDuration.toString(), // Convertir en chaîne si nécessaire
            // Autres métadonnées de piste
          }
          // ... d'autres pistes
        ]
      });

      const savedAlbum = await newAlbum.save();
      res.status(201).json(savedAlbum);

    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'album : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'album.', details: error.message });
  }
}

module.exports = createAlbum;
