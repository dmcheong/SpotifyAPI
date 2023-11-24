const Audio = require('../../Models/audioModel');

const updateAudio = async (req, res) => {
    try {
      const updatedAudio = await Audio.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedAudio);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

module.exports = updateAudio;