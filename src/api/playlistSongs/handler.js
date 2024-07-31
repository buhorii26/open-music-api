const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(service, validator, SongsService, PlaylistsService) {
    this._service = service;
    this._validator = validator;
    this._songsService = SongsService;
    this._playlistsService = PlaylistsService;

    autoBind(this);
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      // verifikasi playlist access
      await this._playlistsService.verifyPlaylistSongsAccess(
        playlistId,
        credentialId,
      );
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

  async getSongOnPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // verifikasi playlist access
    await this._playlistsService.verifyPlaylistSongsAccess(
      playlistId,
      credentialId,
    );
    const playlist = await this._service.getSongInPlaylist(
      playlistId,
      credentialId,
    );
    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongOnPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    // validasi apakah songId bertipe string atau bukan
    this._validator.validatePlaylistSongsPayload({ songId });
    // verifikasi playlist access
    await this._playlistsService.verifyPlaylistSongsAccess(
      playlistId,
      credentialId,
    );
    await this._service.deleteSongInPlaylist(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongsHandler;