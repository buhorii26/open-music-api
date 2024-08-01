const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongActivities {
  constructor() {
    this._pool = new Pool();
  }

  async addActivitiesInPlaylist({
    playlistId, songId, userId, action,
  }) {
    const id = `activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan aktifitas');
    }
  }

  async getActivitesInPlaylist(id) {
    const query = {
      text: `SELECT * FROM playlist_song_activities 
      INNER JOIN users ON playlist_song_activities.playlist_id = playlists.id 
      INNER JOIN songs ON playlist_song_activities.song_id = songs.id 
      INNER JOIN users ON playlist_song_activities.user_id = users.id 
      WHERE id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistSongActivities;
