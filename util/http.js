class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

const createHttpError = (statusCode, message, details) =>
  new HttpError(statusCode, message, details);

const sendResponse = (res, { statusCode = 200, message, payload = {} } = {}) =>
  res.status(statusCode).json({
    ...(message ? { message } : {}),
    ...payload,
  });

const sendError = (res, { statusCode = 500, message, details } = {}) =>
  res.status(statusCode).json({
    ...(message ? { message } : {}),
    ...(details ? { details } : {}),
  });

module.exports = {
  HttpError,
  createHttpError,
  sendError,
  sendResponse,
};
