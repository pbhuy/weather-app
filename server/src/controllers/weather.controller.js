const httpStatus = require('http-status');
const dotenv = require('dotenv');
const cron = require('node-cron');

const { weatherService, emailService } = require('../services');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');
const { Email } = require('../models');

// Scheduler storage for active jobs
const scheduledJobs = new Map();

/**
 * Schedule daily weather notifications
 * @param {string} email
 * @param {Function} sendWeatherEmail - Function to send the weather email
 */
const scheduleWeatherNotification = (email, sendWeatherEmail) => {
  // Remove existing job if any
  if (scheduledJobs.has(email)) {
    scheduledJobs.get(email).stop();
  }

  // Create a new cron job
  const job = cron.schedule('0 7 * * *', async () => {
    // Runs daily at 07:00 AM
    try {
      await sendWeatherEmail(email);
    } catch (error) {
      console.error(`Failed to send weather notification to ${email}: ${error.message}`);
    }
  });

  scheduledJobs.set(email, job);
};

const getWeather = async (req, res, next) => {
  const { term } = req.query;
  try {
    const result = await weatherService.getWeather(term);
    const response = new ApiResponse(true, httpStatus.OK, result);
    res.send(response);
  } catch (error) {
    next(new AppError(httpStatus.BAD_REQUEST, error.message));
  }
};

const getForecast = async (req, res, next) => {
  const { term, days } = req.query;
  try {
    const result = await weatherService.getForecast(term, days);
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

    // Schedule daily weather notifications
    scheduleWeatherNotification(email, async () => {
      // Implement the logic to get the weather data and send the email
      const weatherData = await weatherService.getWeatherForEmail(); // You need to implement getWeatherForEmail
      await emailService.sendWeatherEmail(email, weatherData);
    });

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

    // Remove the cron job
    if (scheduledJobs.has(email)) {
      scheduledJobs.get(email).stop();
      scheduledJobs.delete(email);
    }

    const result = await emailService.sendUnsubscribeEmail(email);
    const response = new ApiResponse(true, httpStatus.OK, result, 'Successfully unsubscribed from weather forecasts');
    res.send(response);
  } catch (error) {
    next(new AppError(httpStatus.BAD_REQUEST, error.message));
  }
};

module.exports = {
  getForecast,
  getWeather,
  subscribeWeatherForecast,
  unsubscribeWeatherForecast,
};
