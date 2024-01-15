const redis = require('redis');
const client = require('../../config/redis-config');

const Audio = require('../../models/AudioModel');

// Fermeture du client Redis lors de la fermeture de l'application
// process.on('SIGINT', () => {
//   client.quit();
//   process.exit();
// });

async function getAllAudio(req, res, next) {
  try {
    // const cacheKey = 'allAudio';

    // // Vérifier si les résultats sont en cache
    // const cachedResults = await client.get(cacheKey);
    // if (cachedResults) {
    //   return res.status(200).json(JSON.parse(cachedResults));
    // }

    // Si les résultats ne sont pas en cache, effectuer la requête
    const allAudio = await Audio.find();

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs de chaque document
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').map(field => field.trim());
      const filteredAudio = allAudio.map(audio => {
        return filteredFields.reduce((obj, field) => {
          obj[field] = audio[field];
          return obj;
        }, {});
      });

      // // Mettre les résultats filtrés en cache avec une expiration de 1 heure (3600 secondes)
      // client.setex(cacheKey, 3600, JSON.stringify(filteredAudio));

      return res.status(200).json(filteredAudio);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez tous les documents Audio

    // // Mettre les résultats complets en cache avec une expiration de 1 heure (3600 secondes)
    // client.setex(cacheKey, 3600, JSON.stringify(allAudio));

    res.status(200).json(allAudio);

  } catch (error) {
    console.error('Erreur lors de la récupération de tous les audios : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de tous les audios.' });
  }
}

module.exports = getAllAudio;