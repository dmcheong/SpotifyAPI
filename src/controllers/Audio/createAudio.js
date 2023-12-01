const Audio = require('../models/audioModel');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');

// Fonction pour convertir l'audio en .m4a
async function convertAudioToM4a(audioBuffer) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(audioBuffer)
      .audioCodec('aac')
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', (err) => reject(err))
      .toFormat('mp4')
      .pipe();
  });
}

// Fonction pour convertir l'image en plusieurs formats
async function convertImageToMultipleFormats(imageBuffer) {
  const formats = ['jpeg', 'png'];
  const convertedImageBuffers = await Promise.all(
    formats.map(async (format) => {
      return sharp(imageBuffer)
        .toFormat(format)
        .toBuffer();
    })
  );

  return convertedImageBuffers;
}

const createAudio = async (req, res) => {
  try {
    // Récupérer les données de la requête
    const { pochetteAlbum, titre, duree, auteur, compositeur, dateSortie, audio, albumId, artisteId } = req.body;

    // Convertir l'audio en .m4a (ou wav)
    const convertedAudioBuffer = await convertAudioToM4a(Buffer.from(audio, 'base64'));

    // Convertir l'image en plusieurs formats (à utiliser en front selon les besoins)
    const convertedImageBuffers = await convertImageToMultipleFormats(Buffer.from(pochetteAlbum, 'base64'));

    // Créer une nouvelle instance de Musique avec les données converties
    const nouvelleMusique = new Musique({
      pochetteAlbum: convertedImageBuffers,
      titre,
      duree,
      auteur,
      compositeur,
      dateSortie,
      audio: convertedAudioBuffer,
      album: albumId,
      artiste: artisteId,
    });

    // Enregistrer la musique dans la base de données
    const musiqueEnregistree = await nouvelleMusique.save();

    res.status(201).json(musiqueEnregistree);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = createAudio;