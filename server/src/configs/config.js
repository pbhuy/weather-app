const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT;
const client = {
  url: process.env.CLIENT_URL,
};
const mongoose = {
  url: process.env.MONGODB_URL,
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
const jwt = {
  secret: process.env.JWT_SECRET,
  accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
  refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
};
const email = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  from: process.env.EMAIL_FROM,
};
const weather = {
  baseURL: process.env.BASE_WEATHER_API_URL,
  apiKey: process.env.WEATHER_API_KEY,
};
module.exports = {
  port,
  client,
  mongoose,
  jwt,
  email,
  weather,
};
