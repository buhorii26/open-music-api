const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverImageHandler(request, h) {
    const { cover } = request.payload;
    if (!cover || !cover.hapi) {
      const response = h.response({
        status: 'fail',
        message: 'Invalid file upload payload',
      });
      response.code(400);
      return response;
    }
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      cover: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/albums/{id}/covers/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
