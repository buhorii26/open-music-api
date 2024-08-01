const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongActivitiesHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async getActivitiesInPlaylistHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      // verifikasi playlist access
      await this._playlistsService.verifyPlaylistSongsAccess(
        playlistId,
        credentialId,
      );
      await this._service.getActivitesInPlaylist(playlistId);

      const response = h.response({
        status: 'success',
        message: 'Activities berhasil!',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }
      const res = h.response({
        status: 'error',
        message: 'Maaf terjadi kesalahan pada server kami',
      });
      res.code(500);
      return res;
    }
  }
}
module.exports = PlaylistSongActivitiesHandler;
