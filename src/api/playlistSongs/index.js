const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');
const SongsService = require('../../services/postgre/SongsService');

const songsService = new SongsService();

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(service, validator, songsService);
    server.route(routes(playlistSongsHandler));
  },
};
