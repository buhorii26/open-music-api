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

const UserMapToModel = ({
  id, username, password, fullname,
}) => ({
  id,
  username,
  password,
  fullname,
});

module.exports = { AlbumMapToModel, SongMapToModel, UserMapToModel };
