const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

// // Nouvelle configuration de connexion MongoDB
// const mongoOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// Connexion à la base de données MongoDB
// mongoose.connect(uri, mongoOptions);
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connexion à MongoDB établie avec succès');
});

connection.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB : ', err);
});

connection.on('disconnected', () => {
  console.log('Déconnexion de MongoDB');
});

// Fermer la connexion MongoDB lors de l'arrêt de l'application
process.on('SIGINT', () => {
  connection.close(() => {
    console.log('Fermeture de la connexion MongoDB à l\'arrêt de l\'application');
    process.exit(0);
  });
});

module.exports = mongooseConfig;
