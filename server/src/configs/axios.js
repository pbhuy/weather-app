const axios = require('axios');
const config = require('../configs/config');

const instance = axios.create({
  baseURL: config.weather.baseURL,
  params: {
    key: config.weather.apiKey,
  },
  headers: {
    accept: 'application/json',
  },
});

module.exports = instance;
