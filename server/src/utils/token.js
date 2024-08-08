const jwt = require('jsonwebtoken');

const config = require('../configs/config');
const ApiResponse = require('./ApiResponse');
const httpStatus = require('http-status');

const secret = config.jwt.secret;

function generateToken(payload, expiresTime) {
  const options = {
    algorithm: 'HS256',
    issuer: 'pbhuy',
    expiresIn: '10m',
  };
  const token = jwt.sign(payload, secret, options);
  return token;
}

function generateVerifyEmailToken(payload) {
  const expiresIn = `${config.jwt.verifyEmailExpirationMinutes}m`;
  const verifyEmailToken = generateToken(payload, expiresIn);
  return verifyEmailToken;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateVerifyEmailToken,
  verifyToken,
};
