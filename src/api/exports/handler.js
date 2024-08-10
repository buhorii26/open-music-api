const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, playlistsService, collaborationsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._collaborationsService = collaborationsService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    // Verifikasi akses ke playlist (pemilik atau kolaborator)
    try {
      await this._playlistsService.verifyPlaylistSongsAccess(playlistId, credentialId);
    } catch (error) {
      console.log('User is not the owner, checking collaborator:', error.message);
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, credentialId);
      } catch (collaborationError) {
        console.log('User is not a collaborator, retrying playlist access:', collaborationError.message);
        // Mengembalikan verifikasi playlist access setelah kolaborasi dihapus
        await this._playlistsService.verifyPlaylistSongsAccess(playlistId, credentialId);
      }
    }
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlists = await this._playlistsService.getPlaylists(playlistId);
    const message = {
      playlists,
      targetEmail: request.payload.targetEmail,
    };
    await this._service.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses!',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
