const { uploadToS3 } = require('../../config/aws-config');
const Artiste = require('../../models/ArtisteModel');
const musicMetadata = require('music-metadata');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');

async function createArtiste(req, res, next) {
  try {
    const file = req.file; // Fichier uploadé
    const tempAudioFilePath = `chemin-temporaire/${file.originalname}.m4a`;

    // Conversion en format .m4a
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
    const audioMetadata = await musicMetadata.parseFile(
      Buffer.from(require('fs').readFileSync(tempAudioFilePath))
    );

    // Upload de la couverture dans S3 si elle existe
    let s3CoverUrl = null;
    if (audioMetadata.common.picture && audioMetadata.common.picture.length > 0) {
      const coverImage = audioMetadata.common.picture[0];
      const tempCoverFilePath = `chemin-temporaire/cover-${file.originalname}.jpg`;

      // Sauvegarde de la couverture temporaire dans un fichier
      require('fs').writeFileSync(tempCoverFilePath, coverImage.data);

      // Upload de la couverture dans S3
      s3CoverUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempCoverFilePath)),
        originalname: `cover-${file.originalname}.jpg`,
      });

      // Suppression du fichier de couverture temporaire
      require('fs').unlinkSync(tempCoverFilePath);
    }

    function generateArtistId() {
      return uuid.v4();
    }
    
    // Enregistrement dans MongoDB avec l'URL de la couverture
    const newArtiste = new Artiste({
      artist_id: generateArtistId(),
      name: req.body.name, 
      artist: req.body.name, 
      albums: [], // Initialement, aucun album associé
      audio: [], // Initialement, aucun fichier audio associé
      // ... autres champs
    });

    if (s3CoverUrl) {
      newArtiste.urlCover = s3CoverUrl;
    }

    const savedArtiste = await newArtiste.save();
    res.status(201).json(savedArtiste);
  } catch (error) {
    console.error('Erreur lors de la création de l\'artiste : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'artiste.', details: error.message });
  }
}

module.exports = createArtiste;
