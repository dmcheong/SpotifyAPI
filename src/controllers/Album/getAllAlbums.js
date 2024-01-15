const redis = require('redis');
const client = require('../../config/redis-config');

const Album = require('../../models/AlbumModel');

async function getAllAlbums(req, res, next) {
  try {
    // const cacheKey = 'allAlbums';

    // // Vérifier si les résultats sont en cache
    // const cachedResults = await client.get(cacheKey);
    // if (cachedResults) {
    //   return res.status(200).json(JSON.parse(cachedResults));
    // }

    // Si les résultats ne sont pas en cache, effectuer la requête
    const allAlbums = await Album.find();

    // Si le paramètre 'fields' est présent dans la requête, filtrez les champs de chaque document
    if (req.query.fields) {
      const filteredFields = req.query.fields.split(',').map(field => field.trim());
      const filteredAlbums = allAlbums.map(album => {
        return filteredFields.reduce((obj, field) => {
          obj[field] = album[field];
          return obj;
        }, {});
      });

      // // Mettre les résultats filtrés en cache avec une expiration de 1 heure (3600 secondes)
      // client.setex(cacheKey, 3600, JSON.stringify(filteredAlbums));

      return res.status(200).json(filteredAlbums);
    }

    // Si aucun paramètre 'fields' n'est fourni, renvoyez tous les documents Album

    // // Mettre les résultats complets en cache avec une expiration de 1 heure (3600 secondes)
    // client.setex(cacheKey, 3600, JSON.stringify(allAlbums));

    res.status(200).json(allAlbums);

  } catch (error) {
    console.error('Erreur lors de la récupération de tous les albums : ', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de tous les albums.' });
  }
}

// // Fermeture du client Redis lors de la fermeture de l'application
// process.on('SIGINT', () => {
//   client.quit();
//   process.exit();
// });

module.exports = getAllAlbums;