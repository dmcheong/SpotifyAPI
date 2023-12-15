const Audio = require('../../models/AudioModel');

const getAudioById = async (req, res) => {
    try {
      const audio = await Audio.findById(req.params.id);
      res.json(audio);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = getAudioById;