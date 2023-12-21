const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const caPath = path.resolve(__dirname, './ca.pem');
const uri = process.env.MONGODB_URI;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsCAFile: caPath,
  tlsAllowInvalidCertificates: true,
};

mongoose.connect(uri, mongoOptions);

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

// process.on('SIGINT', () => {
//   connection.close(() => {
//     console.log('Fermeture de la connexion MongoDB à l\'arrêt de l\'application');
//     process.exit(0);
//   });
// });

module.exports = mongoose;
