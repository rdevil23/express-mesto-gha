const httpConstants = require('http2').constants;
const BadRequestError = require('./bad-request-err');
const NotFoundError = require('./not-found-err');
const AuthError = require('./auth-err');
const ForbiddenError = require('./forbidden-err');
const ConflictError = require('./conflict-err');
const ServerError = require('./server-err');

const OK = httpConstants.HTTP_STATUS_OK; // 200
const CREATED = httpConstants.HTTP_STATUS_CREATED; // 201
const BAD_REQUEST = httpConstants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND = httpConstants.HTTP_STATUS_NOT_FOUND; // 404
const UNAUTHORIZED = httpConstants.HTTP_STATUS_UNAUTHORIZED; // 401
const FORBIDDEN = httpConstants.HTTP_STATUS_FORBIDDEN; // 403
const CONFLICT = httpConstants.HTTP_STATUS_CONFLICT; // 409
const SERVER_ERROR = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  SERVER_ERROR,
  BadRequestError,
  NotFoundError,
  AuthError,
  ForbiddenError,
  ConflictError,
  ServerError,
};
