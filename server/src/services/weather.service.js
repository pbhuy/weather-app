const httpStatus = require('http-status');
const AppError = require('../utils/AppError');

const weatherApiClient = require('../configs/axios');

const getWeatherForCity = async (city) => {
  const response = await weatherApiClient.get('/current.json', {
    params: {
      q: city,
    },
  });
  const { location, current } = response.data;
  const result = {
    city: location.name,
    country: location.country,
    temperature: current.temp_c,
    feelsLike: current.feelslike_c,
    humidity: current.humidity,
    pressure: current.pressure_mb,
    weatherDescription: current.condition.text,
    windSpeed: current.wind_kph,
    windDirection: current.wind_dir,
  };
  return result;
};

const getForecast = async (city, days = 4) => {
  const response = await weatherApiClient.get('/forecast.json', {
    params: {
      q: city,
      days: days,
    },
  });
  return response.data.forecast.forecastday.map((day) => ({
    date: day.date,
    maxTemp: day.day.maxtemp_c,
    minTemp: day.day.mintemp_c,
    avgTemp: day.day.avgtemp_c,
    weatherDescription: day.day.condition.text,
    maxWind: day.day.maxwind_kph,
    totalPrecipitation: day.day.totalprecip_mm,
    avgHumidity: day.day.avghumidity,
  }));
};

module.exports = {
  getForecast,
  getWeatherForCity,
};
