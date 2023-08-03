const httpConstants = require('http2').constants;

const OK = httpConstants.HTTP_STATUS_OK; // 200
const CREATED = httpConstants.HTTP_STATUS_CREATED; // 201
const BAD_REQUEST = httpConstants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND = httpConstants.HTTP_STATUS_NOT_FOUND; // 404
const SERVER_ERROR = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
};
