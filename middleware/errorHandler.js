const { HttpError, createHttpError, sendError } = require("../util/http");

const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (!(error instanceof HttpError)) {
    console.error(error);
  }

  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message =
    error instanceof HttpError ? error.message : "Internal Server Error";

  sendError(res, {
    statusCode,
    message,
    details: error instanceof HttpError ? error.details : undefined,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
