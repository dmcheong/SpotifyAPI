const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configurer le stockage avec Multer
const storage = multer.memoryStorage();

// Configurer Multer avec la limite de taille de fichier à 50 Mo
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Limite de taille à 50 Mo
});

// Importer vos contrôleurs pour les audios
const getAllAudios = require('../controllers/Audio/getAllAudios');
const getAudioById = require('../controllers/Audio/getAudioById');
const createAudio = require('../controllers/Audio/createAudio');
const updateAudio = require('../controllers/Audio/updateAudio');
const deleteAudio = require('../controllers/Audio/deleteAudio');

// Routes pour les audios
router.get('/', getAllAudios);
router.get('/:id', getAudioById);
// Définir les routes avec Multer middleware
router.post('/', upload.single('file'), createAudio);
router.put('/:id', updateAudio);
router.delete('/:id', deleteAudio);

module.exports = router;



// const express = require('express');
// const multer = require('multer');
// const router = express.Router();

// // Configurer le stockage avec Multer
// const storage = multer.memoryStorage();

// // Configurer Multer avec la limite de taille de fichier à 50 Mo
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 } // Limite de taille à 50 Mo
// });
 

// // Importation des contrôleurs pour les audios
// const getAllAudios = require('../controllers/Audio/getAllAudios');
// const getAudioById = require('../controllers/Audio/getAudioById');
// const createAudio = require('../controllers/Audio/createAudio');
// const updateAudio = require('../controllers/Audio/updateAudio');
// const deleteAudio = require('../controllers/Audio/deleteAudio');

// // Routes pour les audios
// router.get('/', getAllAudios);
// router.get('/:id', getAudioById);

// // // Définir les routes avec Multer middleware
// // router.post('/', (req, res, next) => {
// //   upload.single('file')(req, res, function (err) {
// //     if (err) {
// //       if (err instanceof multer.MulterError) {
// //         // Une erreur Multer s'est produite lors du téléchargement du fichier
// //         if (err.code === 'LIMIT_FILE_SIZE') {
// //           return res.status(400).json({ error: 'La taille du fichier dépasse la limite autorisée.' });
// //         } else {
// //           return res.status(400).json({ error: 'Erreur lors du téléchargement du fichier.' });
// //         }
// //       } else {
// //         // Une erreur inattendue s'est produite
// //         return res.status(500).json({ error: 'Erreur inattendue lors du téléchargement du fichier.' });
// //       }
// //     }

// //     // Le fichier a été téléchargé avec succès, continuez avec le traitement normal
// //     createAudio(req, res, next);
// //   });
// // });

// // Définir les routes avec Multer middleware
// router.post('/', upload.single('file'), (req, res, next) => {
//   // Si le fichier n'est pas téléchargé correctement, gérer l'erreur
//   if (!req.file) {
//     return res.status(400).json({ error: 'Aucun fichier audio trouvé.' });
//   }

//   // Le fichier a été téléchargé avec succès, continuez avec le traitement normal
//   createAudio(req, res, next);
// });

// router.put('/:id', updateAudio);
// router.delete('/:id', deleteAudio);

// module.exports = router;