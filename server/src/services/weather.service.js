const httpStatus = require('http-status');
const AppError = require('../utils/AppError');

const weatherApiClient = require('../configs/axios');

const getWeather = async (term) => {
  const response = await weatherApiClient.get('/current.json', {
    params: {
      q: term,
    },
  });
  const result = response.data;
  return result;
};
const getWeatherForEmail = async () => {
  const terms = ['London', 'Tokyo', 'Paris', 'New York', 'Vietnam'];
  let result = [];
  for (const term of terms) {
    const response = await weatherApiClient.get('/current.json', {
      params: {
        q: term,
      },
    });
    result.push(response.data);
  }
  return result;
};

const getForecast = async (term, days = 4) => {
  const response = await weatherApiClient.get('/forecast.json', {
    params: {
      q: term,
      days: days,
    },
  });
  return response.data;
};

module.exports = {
  getForecast,
  getWeatherForEmail,
  getWeather,
};
