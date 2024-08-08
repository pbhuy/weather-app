const mongoose = require('mongoose');
const httpStatus = require('http-status');

const logger = require('../configs/logger');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof AppError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new AppError(statusCode, message);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  if (!message) message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

  const response = new ApiResponse(false, statusCode, null, message, err);
  logger.error(err);

  return res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
