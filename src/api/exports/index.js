const ExportsHandler = require('./handler');
const routes = require('./routes');
const PlaylistsService = require('../../services/postgre/PlaylistsService');
const CollaborionsService = require('../../services/postgre/CollaborationsService');

const playlistsService = new PlaylistsService();
const collaborationsService = new CollaborionsService();

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportsHandler = new ExportsHandler(
      service,
      playlistsService,
      collaborationsService,
      validator,
    );
    server.route(routes(exportsHandler));
  },
};
