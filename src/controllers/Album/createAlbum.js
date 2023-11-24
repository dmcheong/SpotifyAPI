const Album = require('../models/albumModel');

const createAlbum = async (req, res) => {
    try {
        const newAlbum = await Album.create(req.body);
        res.json(newAlbum);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = createAlbum;