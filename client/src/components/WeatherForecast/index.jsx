import './style.scss';
import instance from '../../configs/axios';
import { useEffect, useState } from 'react';

function WeatherForecast({ searchTerm, coordinates }) {
  const [weather, setWeather] = useState(null);
  const [foreCast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [visibleDays, setVisibleDays] = useState(4);
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          instance.get(
            coordinates
              ? `/weather?term=${coordinates.latitude},${coordinates.longitude}`
              : `/weather?term=${searchTerm}`
          ),
          instance.get(
            coordinates
              ? `/weather/forecast?term=${coordinates.latitude},${coordinates.longitude}&days=14`
              : `/weather/forecast?term=${searchTerm}&days=14`
          ),
        ]);

        setWeather(weatherResponse.data.data);
        setForecast(forecastResponse.data.data);
      } catch (err) {
        setError('Failed to fetch weather data');
      }
    };

    fetchWeatherData();
  }, [searchTerm]);

  const loadMoreDays = () => {
    setVisibleDays((prevVisibleDays) => prevVisibleDays + 4);
  };
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  if (!weather) {
    return <div>Loading...</div>;
  }
  const { location, current } = weather;
  const { forecast } = foreCast;
  return (
    <div className="weather-data">
      <div className="current-weather">
        <div className="details">
          <h2>
            {location.country}, {location.name} ({location.localtime})
          </h2>
          <h4>Temperature: {current.temp_c}°C</h4>
          <h4>Wind: {current.wind_kph} KPH</h4>
          <h4>Humidity: {current.humidity}%</h4>
        </div>
        <div className="icon">
          <img src={`https:${current.condition.icon}`} alt="weather-icon" />
          <h4>{current.condition.text}</h4>
        </div>
      </div>
      <div className="days-forecast">
        <h2>Days Forecast</h2>
        <div className="weather-cards-container">
          <ul className="weather-cards">
            {forecast.forecastday.slice(0, visibleDays).map((day) => (
              <li className="card" key={day.date}>
                <h3>{day.date}</h3>
                <img src={`https:${day.day.condition.icon}`} alt="weather-icon" />
                <h4>Condition: {day.day.condition.text}</h4>
                <h4>Max Temp: {day.day.maxtemp_c}°C</h4>
                <h4>Min Temp: {day.day.mintemp_c}°C</h4>
                <h4>Wind: {day.day.maxwind_kph} KPH</h4>
                <h4>Chance of Rain: {day.day.daily_chance_of_rain}%</h4>
                <h4>Humidity: {day.day.avghumidity}%</h4>
              </li>
            ))}
          </ul>
        </div>
        {visibleDays < forecast.forecastday.length && <button onClick={loadMoreDays}>Load more</button>}
      </div>
    </div>
  );
}

export default WeatherForecast;
