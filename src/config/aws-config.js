const AWS = require('aws-sdk');
require('dotenv').config();

// Configurations AWS
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;
const awsRegion = process.env.AWS_REGION;
// const bucketName = process.env.S3_BUCKET;

// Configuration AWS SDK
AWS.config.update({
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
  region: awsRegion,
});

// Créer une instance S3
const s3 = new AWS.S3();

// Vérifier si la configuration s'est bien passée
AWS.config.getCredentials((err) => {
  if (err) {
    console.error('Erreur lors de la configuration AWS:', err);
  } else {
    console.log('Configuration AWS réussie');
  }
});

module.exports = s3;
