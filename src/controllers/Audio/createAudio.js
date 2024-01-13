const Audio = require('../../models/AudioModel');
const ffmpeg = require('fluent-ffmpeg');
const musicMetadata = require('music-metadata');
const { uploadToS3 } = require('../../config/aws-config');
const util = require('util');
const fs = require('fs');
const path = require('path');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);

async function createAudio(req, res, next) {
  try {
    const file = req.file;
    console.log('Fichier téléchargé avec succès :', file);

    const tempFolderPath = './src/controllers/Audio/cheminTemporaire';
    const tempAudioFilePath = path.join(tempFolderPath, `${file.originalname}.mp3`);
    console.log('Chemin temporaire pour le fichier audio :', tempAudioFilePath);

    // Vérifier si le dossier temporaire existe, sinon le créer
    if (!fs.existsSync(tempFolderPath)) {
      console.log('Création du dossier temporaire');
      await mkdir(tempFolderPath);
      console.log('Dossier temporaire créé avec succès');
    }

    // Sauvegarde du buffer dans un fichier temporaire
    console.log('Sauvegarde du fichier audio temporaire');
    await writeFile(tempAudioFilePath, file.buffer);
    console.log('Fichier audio temporaire sauvegardé avec succès');

    // Conversion en format .m4a
    console.log('Conversion en format .m4a');
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(tempAudioFilePath)
        .audioCodec('aac')
        .toFormat('m4a')
        .on('end', () => {
          console.log('Conversion en format .m4a réussie');
          resolve();
        })
        .on('error', (err) => {
          console.error('Erreur lors de la conversion en format .m4a : ', err);
          reject(err);
        })
        .save(tempAudioFilePath + '.m4a');
    });
    // Extraction des métadonnées du fichier audio converti
    console.log('Extraction des métadonnées du fichier audio converti');
    const audioBuffer = Buffer.from(require('fs').readFileSync(tempAudioFilePath));
    console.log('Contenu du fichier converti :', audioBuffer);

    const audioMetadata = await musicMetadata.parseFile(audioBuffer);

    // Upload du fichier audio dans S3
    console.log('Upload du fichier audio dans S3');
    const s3AudioUrl = await uploadToS3({
      buffer: audioBuffer,
      originalname: `${file.originalname}.m4a`,
    });

    // Suppression du fichier audio temporaire
    console.log('Suppression du fichier audio temporaire');
    require('fs').unlinkSync(tempAudioFilePath);

    // Upload de la couverture dans S3 si elle existe
    let s3CoverUrl = null;
    if (audioMetadata.common.picture && audioMetadata.common.picture.length > 0) {
      console.log('La couverture existe, téléchargement dans S3');
      const coverImage = audioMetadata.common.picture[0];
      const tempCoverFilePath = `chemin-temporaire/cover-${file.originalname}.jpg`;

      // Sauvegarde de la couverture temporaire dans un fichier
      console.log('Sauvegarde de la couverture temporaire dans un fichier');
      require('fs').writeFileSync(tempCoverFilePath, coverImage.data);

      // Upload de la couverture dans S3
      console.log('Upload de la couverture dans S3');
      s3CoverUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempCoverFilePath)),
        originalname: `cover-${file.originalname}.jpg`,
      });

      // Suppression du fichier de couverture temporaire
      console.log('Suppression du fichier de couverture temporaire');
      require('fs').unlinkSync(tempCoverFilePath);
    }

    // Enregistrement dans MongoDB avec l'URL de la couverture
    console.log('Enregistrement dans MongoDB avec l\'URL de la couverture');
    const newAudio = new Audio({
      title: req.body.audioTitle,
      album: req.body.albumTitle,
      duration: req.body.audioDuration,
      artist: req.body.artist,
      urlAudio: s3AudioUrl,
      urlCover: s3CoverUrl,
      // ... autres champs
    });

    const savedAudio = await newAudio.save();
    console.log('Bande sonore enregistrée avec succès dans MongoDB');

    res.status(201).json(savedAudio);
  } catch (error) {
    console.error('Erreur lors de la création de la bande sonore : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de la bande sonore.' });
  }
}

module.exports = createAudio;
