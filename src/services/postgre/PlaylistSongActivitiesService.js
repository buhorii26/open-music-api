const { Pool } = require('pg');

class PlaylistSongActivities {
  constructor() {
    this._pool = new Pool();
  }

  async getActivitesInPlaylist(id) {
    const query = {
      text: 'SELECT * FROM playlist_song_activities WHERE playlist_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
module.exports = PlaylistSongActivities;
