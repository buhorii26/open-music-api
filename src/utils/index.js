const AlbumMapToModel = ({
  id_album,
  name,
  year,
}) => ({
  id_album,
  name,
  year,
});

const SongMapToModel = ({
  id_songs,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id_songs,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { AlbumMapToModel, SongMapToModel };
