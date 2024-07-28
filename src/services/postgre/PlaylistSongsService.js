const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylists({ title, performer }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO song VALUES($1, $2, $3) RETURNING id',
      values: [id, title, performer],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlists gagal ditambahkan');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistsService;
