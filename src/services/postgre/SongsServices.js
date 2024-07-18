const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { SongMapToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id_songs = `songs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_songs',
      values: [id_songs, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id_songs) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id_songs;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(SongMapToModel);
  }

  async getSongById(id_songs) {
    const query = {
      text: 'SELECT * FROM songs WHERE id_songs = $1',
      values: [id_songs],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return result.rows.map(SongMapToModel)[0];
  }

  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT id_songs, title, performer FROM songs WHERE albumId = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(SongMapToModel)[0];
  }

  async editSongById(id_songs, {
    title,
    year,
    genre,
    performer,
    duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $2, year = $3, genre = $4, performer = $5, duration = $6 WHERE id_songs = $1 RETURNING id_songs',
      values: [id_songs, title, year, genre, performer, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id_songs) {
    const query = {
      text: 'DELETE FROM songs WHERE id_songs = $1 RETURNING id_songs',
      values: [id_songs],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
