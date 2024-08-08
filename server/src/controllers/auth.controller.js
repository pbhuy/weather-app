const httpStatus = require('http-status');

const { generateVerifyEmailToken } = require('../utils/token');
const { authService, emailService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');
const logger = require('../configs/logger');

const sendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const payload = {
      email,
    };
    const verifyEmailToken = generateVerifyEmailToken(payload);
    await emailService.sendVerificationEmail(email, verifyEmailToken);
    const response = new ApiResponse(true, httpStatus.OK, null, 'Please check email to verify');
    res.send(response);
  } catch (error) {
    logger.error(error);
    next(new AppError(httpStatus.BAD_REQUEST, error));
  }
};

const verifyEmail = async (req, res, next) => {
  const { token } = req.body;
  try {
    await authService.verifyEmail(token);
    const response = new ApiResponse(true, httpStatus.OK, null, 'Congratulation!! You are verified successfully');
    res.send(response);
  } catch (error) {
    logger.error(error);
    next(new AppError(httpStatus.BAD_REQUEST, error));
  }
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
};
