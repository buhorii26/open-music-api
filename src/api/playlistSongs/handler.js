const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(service, validator, SongsService) {
    this._service = service;
    this._validator = validator;
    this._songsService = SongsService;

    autoBind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      // Periksa apakah songId ada di tabel songs
      await this._songsService.verifySong(songId);
      const playlistSongsId = await this._service.addSongToPlaylist({
        playlistId,
        songId,
        owner: credentialId,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke dalam playlists',
        data: {
          playlistSongsId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // async getSongsOnPlaylistHandler(request, h) {}

  // async deleteSongsOnPlaylistHandler(request, h) {}
}

module.exports = PlaylistSongsHandler;
