const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

// Nouvelle configuration de connexion MongoDB
const mongoOptions = {
    useNewUrlParser: true, // Note: Ce n'est plus nécessaire, mais peut être laissé pour la compatibilité
    useUnifiedTopology: true,
  };
  
// Connexion à la base de données MongoDB
mongoose.connect(uri, mongoOptions);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Connexion à MongoDB établie avec succès');
  process.exit(0); // Quitte le script avec un code de sortie 0 (succès)
});

connection.on('error', (err) => {
  console.error('Erreur de connexion à MongoDB : ', err);
  process.exit(1); // Quitte le script avec un code de sortie différent de zéro (échec)
});
