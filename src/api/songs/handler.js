const autoBind = require('auto-bind');

class SongsHandler {
  constructor(
    service,
    validator,

  ) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title = 'untitled', year, genre, performer, duration, albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const songId = await this._service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByAlbumIdHandler(request, h) {
    const { id } = request.params;
    const songId = await this._service.getSongByAlbumId(id);
    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diperbaharui',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
