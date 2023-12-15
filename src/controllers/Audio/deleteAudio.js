const Audio = require('../../models/AudioModel');
const { deleteObjectFromS3 } = require('../../config/aws-config');

const deleteAudio = async (req, res) => {
    try {
      const audioId = req.params.id;

      // Suppression de l'audio dans la base de données
      const deletedAudio = await Audio.findByIdAndDelete(audioId);
  
      // Suppression du fichier multimédia lié dans le bucket S3
      await deleteObjectFromS3(deletedAudio.audioKey); // Assurez-vous d'avoir une clé appropriée dans votre modèle d'audio
  
      res.json({ message: 'Audio deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = deleteAudio;