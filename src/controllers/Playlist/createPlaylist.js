const { uploadToS3 } = require('../../config/aws-config');
const Playlist = require('../../models/PlaylistModel');
const musicMetadata = require('music-metadata');
const ffmpeg = require('fluent-ffmpeg');
const uuid = require('uuid');

async function createPlaylist(req, res, next) {
  try {
    const file = req.file; // Fichier uploadé
    const tempAudioFilePath = `chemin-temporaire/${file.originalname}.m4a`;

    // Conversion en format .m4a
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(file.buffer)
        .audioCodec('aac')
        .toFormat('m4a')
        .on('end', resolve)
        .on('error', reject)
        .save(tempAudioFilePath);
    });

    // Upload du fichier audio dans S3
    const s3AudioUrl = await uploadToS3({
      buffer: Buffer.from(require('fs').readFileSync(tempAudioFilePath)),
      originalname: `${file.originalname}.m4a`,
    });

    // Suppression du fichier audio temporaire
    require('fs').unlinkSync(tempAudioFilePath);

    // Extraction des métadonnées du fichier audio converti
    const audioMetadata = await musicMetadata.parseFile(
      Buffer.from(require('fs').readFileSync(tempAudioFilePath))
    );

    // Upload de la couverture dans S3 si elle existe
    let s3CoverUrl = null;
    if (audioMetadata.common.picture && audioMetadata.common.picture.length > 0) {
      const coverImage = audioMetadata.common.picture[0];
      const tempCoverFilePath = `chemin-temporaire/cover-${file.originalname}.jpg`;

      // Sauvegarde de la couverture temporaire dans un fichier
      require('fs').writeFileSync(tempCoverFilePath, coverImage.data);

      // Upload de la couverture dans S3
      s3CoverUrl = await uploadToS3({
        buffer: Buffer.from(require('fs').readFileSync(tempCoverFilePath)),
        originalname: `cover-${file.originalname}.jpg`,
      });

      // Suppression du fichier de couverture temporaire
      require('fs').unlinkSync(tempCoverFilePath);
    }

    function generateGroupId() {
        return uuid.v4();
    }

    // Création de la structure de groupe audio
    const audioGroup = {
      group_id: generateGroupId(),
      group_title: 'Group Title', // À adapter selon tes besoins
      artist: audioMetadata.common.artist,
      audio_tracks: [
        {
          track_id: generateTrackId(),
          title: audioMetadata.common.title,
          artist: audioMetadata.common.artist,
          artist: audioMetadata.common.artist,
          // Autres métadonnées de piste
        },
        // ... d'autres pistes
      ],
    };

    // Création de la playlist
    const newPlaylist = new Playlist({
      playlist_id: generatePlaylistId(),
      title: 'Playlist Title', // À adapter selon tes besoins
      creator: 'Creator Name', // À adapter selon tes besoins
      description: 'Playlist Description', // À adapter selon tes besoins
      audio_groups: [audioGroup],
    });

    // Enregistrement dans MongoDB avec l'URL de la couverture
    if (s3CoverUrl) {
      newPlaylist.urlCover = s3CoverUrl;
    }

    const savedPlaylist = await newPlaylist.save();
    res.status(201).json(savedPlaylist);

  } catch (error) {
    console.error('Erreur lors de la création de la playlist : ', error);
    res.status(500).json({ error: 'Erreur lors de la création de la playlist.' });
  }
}

module.exports = createPlaylist;
