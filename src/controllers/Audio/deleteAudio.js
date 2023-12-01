const Audio = require('../models/audioModel');

const deleteAudio = async (req, res) => {
    try {
      await Audio.findByIdAndDelete(req.params.id);
      res.json({ message: 'Audio deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = deleteAudio;