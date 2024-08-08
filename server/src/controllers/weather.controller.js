const httpStatus = require('http-status');
const dotenv = require('dotenv');

const { weatherService, emailService } = require('../services');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');
const { Email } = require('../models');

const getWeatherForCity = async (req, res, next) => {
  const { city } = req.query;
  try {
    const result = await weatherService.getWeatherForCity(city);
    const response = new ApiResponse(true, httpStatus.OK, result);
    res.send(response);
  } catch (error) {
    next(new AppError(httpStatus.BAD_REQUEST, error.message));
  }
};

const getForecast = async (req, res, next) => {
  const { city, days } = req.query;
  try {
    const result = await weatherService.getForecast(city, days);
    const response = new ApiResponse(true, httpStatus.OK, result);
    res.send(response);
  } catch (error) {
    next(new AppError(httpStatus.BAD_REQUEST, error.message));
  }
};
const subscribeWeatherForecast = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existedEmail = await Email.findOne({ email });
    if (!existedEmail) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Email address not found'));
    }
    if (!existedEmail.isVerified) return next(new AppError(httpStatus.BAD_REQUEST, 'Email address is not verified'));
    if (existedEmail.isSubscribed)
      return next(new AppError(httpStatus.BAD_REQUEST, 'Email is already subscribed to weather forecasts'));

    await Email.findOneAndUpdate({ email }, { isSubscribed: true });
    const result = await emailService.sendSubscribeEmail(email);
    const response = new ApiResponse(true, httpStatus.OK, result, 'Successfully subscribed to weather forecasts');
    res.send(response);
  } catch (error) {
    next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'An error occurred while processing your subscription'));
  }
};

const unsubscribeWeatherForecast = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existedEmail = await Email.findOne({ email });
    if (!existedEmail) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Email address not found'));
    }
    if (!existedEmail.isVerified) return next(new AppError(httpStatus.BAD_REQUEST, 'Email address is not verified'));
    if (!existedEmail.isSubscribed)
      return next(new AppError(httpStatus.BAD_REQUEST, 'Email is not currently subscribed to weather forecasts'));

    await Email.findOneAndUpdate({ email }, { isSubscribed: false });
    const result = await emailService.sendUnsubscribeEmail(email);
    const response = new ApiResponse(true, httpStatus.OK, result, 'Successfully unsubscribed from weather forecasts');
    res.send(response);
  } catch (error) {
    next(new AppError(httpStatus.BAD_REQUEST, error.message));
  }
};

module.exports = {
  getForecast,
  getWeatherForCity,
  subscribeWeatherForecast,
  unsubscribeWeatherForecast,
};
