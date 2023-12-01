// musiqueRoutes.js
const express = require('express');
const router = express.Router();
const Musique = require('../models/musique');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');

router.post('/musiques', async (req, res) => {
  try {
    // Récupérer les données de la requête
    const { pochetteAlbum, titre, duree, auteur, compositeur, dateSortie, audio } = req.body;

    // Convertir l'audio en .m4a (ou wav)
    const convertedAudioBuffer = await convertAudioToM4a(Buffer.from(audio, 'base64'));

    // Convertir l'image en plusieurs formats (à utiliser en front selon les besoins)
    const convertedImageBuffers = await convertImageToMultipleFormats(Buffer.from(pochetteAlbum, 'base64'));

    // Créer une nouvelle instance de Musique avec les données converties
    const nouvelleMusique = new Musique({
      pochetteAlbum: convertedImageBuffers, // Un tableau de buffers pour les images converties
      titre,
      duree,
      auteur,
      compositeur,
      dateSortie,
      audio: convertedAudioBuffer, // Buffer pour l'audio converti
    });

    // Enregistrer la musique dans la base de données
    const musiqueEnregistree = await nouvelleMusique.save();

    res.status(201).json(musiqueEnregistree);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fonction pour convertir l'audio en .m4a
async function convertAudioToM4a(audioBuffer) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(audioBuffer)
      .audioCodec('aac') // Utiliser le codec AAC pour .m4a
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', (err) => reject(err))
      .toFormat('mp4') // .m4a est essentiellement un fichier mp4 avec uniquement l'audio
      .pipe();
  });
}

// Fonction pour convertir l'image en plusieurs formats
async function convertImageToMultipleFormats(imageBuffer) {
  const formats = ['jpeg', 'png']; // Ajoutez d'autres formats si nécessaire
  const convertedImageBuffers = await Promise.all(
    formats.map(async (format) => {
      return sharp(imageBuffer)
        .toFormat(format)
        .toBuffer();
    })
  );

  return convertedImageBuffers;
}

module.exports = router;
