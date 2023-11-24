const Audio = require('../../Models/audioModel');

const createAudio = async (req, res) => {
    try {
      const newAudio = await Audio.create(req.body);
      res.json(newAudio);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = createAudio;