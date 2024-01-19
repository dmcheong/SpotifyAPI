const AWS = require('aws-sdk');
const fs = require('fs');

require('dotenv').config({ path: '../../.env' });

// Configuration AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// Fonction pour importer les données dans AWS S3
const uploadToS3 = async (localFilePath, s3Key) => {
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: fs.createReadStream(localFilePath),
    };
  
    try {
      const data = await s3.upload(params).promise();
      console.log(`Fichier ${localFilePath} uploadé avec succès vers ${data.Location}`);
      return data.Location;
    } catch (error) {
      console.error(`Erreur lors de l'upload du fichier ${localFilePath} vers S3 :`, error);
      throw error;
    }
  }

module.exports = uploadToS3;