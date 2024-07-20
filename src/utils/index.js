const AlbumMapToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const SongMapToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { AlbumMapToModel, SongMapToModel };
