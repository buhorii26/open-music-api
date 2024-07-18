const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { AlbumMapToModel, SongMapToModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id_album = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id_album ',
      values: [id_album, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id_album) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id_album;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(AlbumMapToModel);
  }

  async getAlbumById(id) {
    let query = {
      text: 'SELECT * FROM albums WHERE id_album = $1',
      values: [id],
    };
    const resultAlbums = await this._pool.query(query);

    if (!resultAlbums.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    query = {
      text: 'SELECT id_songs, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const resultSongs = await this._pool.query(query);
    if (!resultSongs.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const albums = resultAlbums.rows.map(AlbumMapToModel)[0];
    const songs = resultSongs.rows.map(SongMapToModel);
    return {
      ...albums,
      songs,
    };
  }

  async editAlbumById(id_album, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $2, year = $3 WHERE id_album = $1 RETURNING id_album',
      values: [id_album, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id_album) {
    const query = {
      text: 'DELETE FROM albums WHERE id_album = $1 RETURNING id_album',
      values: [id_album],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
