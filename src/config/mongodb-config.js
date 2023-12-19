const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const caPath = path.resolve(__dirname,  process.env.CA_PATH || './ca.pem');

const uri = process.env.MONGODB_URI;

// Nouvelle configuration de connexion MongoDB
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Ajoutez ces options pour activer la connexion SSL/TLS
  ssl: true,
  sslValidate: true,
  sslCA: Buffer.from(fs.readFileSync(caPath)), // Remplacez par le chemin vers votre certificat CA
};

// Connexion à la base de données MongoDB
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

// Fermer la connexion MongoDB lors de l'arrêt de l'application
process.on('SIGINT', () => {
  connection.close(() => {
    console.log('Fermeture de la connexion MongoDB à l\'arrêt de l\'application');
    process.exit(0);
  });
});

module.exports = mongoose;
