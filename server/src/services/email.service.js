const nodemailer = require('nodemailer');
const config = require('../configs/config');
const logger = require('../configs/logger');

const transport = nodemailer.createTransport(config.email.smtp);
const clientURL = config.client.url;

transport
  .verify()
  .then(() => logger.info('Connected to email server'))
  .catch(() =>
    logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env')
  );

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `${clientURL}/verify-email?token=${token}`;
  const html = `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
            rel="stylesheet"
          />
          <title>Weather Forecast | Account Verification</title>
          <style>
            body {
              background-color: #333333;
              height: 100vh;
              font-family: "Roboto", sans-serif;
              color: #fff;
              position: relative;
              text-align: center;
            }
            .container {
              max-width: 700px;
              width: 100%;
              height: 100%;
              margin: 0 auto;
            }
            .wrapper {
              padding: 0 15px;
            }
            .card {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
            span {
              color: #ffc107;
            }
            button {
              padding: 1em 6em;
              border-radius: 5px;
              border: 0;
              background-color: hsl(45, 100%, 51%);
              transition: all 0.3s ease-in;
              cursor: pointer;
            }
            button:hover {
              background-color: hsl(45, 70%, 51%);
              transition: all 0.3s ease-in;
            }
            .spacing {
              margin-top: 5rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="wrapper">
              <div class="card">
                <h1><span>Welcome !</span> And thank you for registering !</h1>
                <p>Please validate your email by clicking the button below 🙂</p>
                <a href=${verificationEmailUrl}><button>Verify email</button></a>
                <p class="spacing">
                  If the button above does not work, please navigate to the link
                  provided below 👇🏻
                </p>
                <div>${verificationEmailUrl}</div>
              </div>
            </div>
          </div>
        </body>
      </html>`;
  await sendEmail(to, subject, html);
};

/**
 * Send subscribe daily weather forecast via email address
 * @param {string} to
 * @returns {Promise}
 */
const sendSubscribeEmail = async (to) => {
  const subject = 'Email Subscribe';
  const text = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Weather App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      width: 80%;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #4CAF50;
    }
    p {
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Weather App!</h1>
    <p>Dear user,</p>
    <p>Thank you for subscribing to our weather forecast service. We are excited to keep you updated with the latest weather information for your selected cities.</p>
    <p>Stay tuned for your daily weather updates. If you have any questions or need assistance, feel free to contact us.</p>
    <p>Best regards,<br>The Weather App Team</p>
    <div class="footer">
      <p>&copy; 2024 Weather App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  await sendEmail(to, subject, text);
};

const sendUnsubscribeEmail = async (to) => {
  const subject = 'Email Unsubscribe';
  const text = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Goodbye from Weather App</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      width: 80%;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #f44336;
    }
    p {
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Goodbye from Weather App!</h1>
    <p>Dear user,</p>
    <p>We are sorry to see you go. Your subscription to our weather forecast service has been successfully canceled.</p>
    <p>If you ever want to re-subscribe, we'll be here to keep you updated with the latest weather information.</p>
    <p>Thank you for using Weather App. We wish you all the best!</p>
    <p>Best regards,<br>The Weather App Team</p>
    <div class="footer">
      <p>&copy; 2024 Weather App. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
  await sendEmail(to, subject, text);
};

const sendWeatherEmail = async (to, weatherData) => {
  const subject = 'Daily Weather Forecast';
  const text = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 80%;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
        }
        .weather-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 10px 0;
            padding: 15px;
            background: #fafafa;
        }
        .weather-card img {
            width: 50px;
            height: 50px;
        }
        .weather-card h2 {
            margin: 0;
        }
        .weather-card p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Weather Update</h1>
        <h3>Dear user,
          Here is your daily weather forecast:</h3>
        <div class="weather-card">
            <h2>${weatherData[0].location.name},${weatherData[0].location.country}</h2>
            <img src="https:${weatherData[0].current.condition.icon}" alt="${weatherData[0].current.condition.text}">
            <p>Temperature: ${weatherData[0].current.temp_c}°C</p>
            <p>Condition: ${weatherData[0].current.condition.text}</p>
            <p>Wind: ${weatherData[0].current.wind_kph} KPH</p>
            <p>Humidity: ${weatherData[0].current.humidity}%</p>
        </div>
        <div class="weather-card">
            <h2>${weatherData[1].location.name},${weatherData[1].location.country}</h2>
            <img src="https:${weatherData[1].current.condition.icon}" alt="${weatherData[1].current.condition.text}">
            <p>Temperature: ${weatherData[1].current.temp_c}°C</p>
            <p>Condition: ${weatherData[1].current.condition.text}</p>
            <p>Wind: ${weatherData[1].current.wind_kph} KPH</p>
            <p>Humidity: ${weatherData[1].current.humidity}%</p>
        </div>
        <div class="weather-card">
            <h2>${weatherData[2].location.name},${weatherData[2].location.country}</h2>
            <img src="https:${weatherData[2].current.condition.icon}" alt="${weatherData[2].current.condition.text}">
            <p>Temperature: ${weatherData[2].current.temp_c}°C</p>
            <p>Condition: ${weatherData[2].current.condition.text}</p>
            <p>Wind: ${weatherData[2].current.wind_kph} KPH</p>
            <p>Humidity: ${weatherData[2].current.humidity}%</p>
        </div>
        <div class="weather-card">
            <h2>${weatherData[3].location.name},${weatherData[3].location.country}</h2>
            <img src="https:${weatherData[3].current.condition.icon}" alt="${weatherData[3].current.condition.text}">
            <p>Temperature: ${weatherData[3].current.temp_c}°C</p>
            <p>Condition: ${weatherData[3].current.condition.text}</p>
            <p>Wind: ${weatherData[3].current.wind_kph} KPH</p>
            <p>Humidity: ${weatherData[3].current.humidity}%</p>
        </div>
        <div class="weather-card">
            <h2>${weatherData[4].location.name},${weatherData[4].location.country}</h2>
            <img src="https:${weatherData[4].current.condition.icon}" alt="${weatherData[4].current.condition.text}">
            <p>Temperature: ${weatherData[4].current.temp_c}°C</p>
            <p>Condition: ${weatherData[4].current.condition.text}</p>
            <p>Wind: ${weatherData[4].current.wind_kph} KPH</p>
            <p>Humidity: ${weatherData[4].current.humidity}%</p>
        </div>
        <p>If you have any questions, please contact us.</p>
    </div>
</body>
</html>`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendVerificationEmail,
  sendSubscribeEmail,
  sendUnsubscribeEmail,
  sendWeatherEmail,
};
