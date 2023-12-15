const Audio = require('../../models/AudioModel');

const getAllAudios = async (req, res) => {
    try {
      const audios = await Audio.find();
      res.json(audios);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = getAllAudios;