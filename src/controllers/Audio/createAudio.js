const Audio = require('../models/audioModel');
const ffmpeg = require('fluent-ffmpeg');
const musicMetadata = require('music-metadata');
const { uploadToS3 } = require('./aws-functions');
// const sharp = require('sharp');

async function createAudio(req, res, next) {
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

      // Enregistrement dans MongoDB avec l'URL de la couverture
      const newAudio = new Audio({
        titre: audioMetadata.common.title,
        artiste: audioMetadata.common.artist,
        album: audioMetadata.common.album,
        duree: audioMetadata.format.duration,
        urlAudio: s3AudioUrl,
        urlCover: s3CoverUrl,
        // ... autres champs
      });

      const savedAudio = await newAudio.save();
      res.status(201).json(savedAudio);
    } else {
      // Si aucune couverture n'est trouvée, enregistrez sans URL de couverture
      const newAudio = new Audio({
        titre: audioMetadata.common.title,
        artiste: audioMetadata.common.artist,
        album: audioMetadata.common.album,
        duree: audioMetadata.format.duration,
        urlAudio: s3AudioUrl,
        // ... autres champs
      });

      const savedAudio = await newAudio.save();
      res.status(201).json(savedAudio);
    }
  } catch (error) {
    console.error('Erreur lors de la création de la bande sonore : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de la bande sonore.' });
  }
}

module.exports = { createAudio };