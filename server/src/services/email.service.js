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
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
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
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send subscribe daily weather forecast via email address
 * @param {string} to
 * @returns {Promise}
 */
const sendSubscribeEmail = async (to) => {
  const subject = 'Email Subscribe';
  const text = `Dear user, you have subscribed successfully`;
  await sendEmail(to, subject, text);
};
const sendUnsubscribeEmail = async (to) => {
  const subject = 'Email Unsubscribe';
  const text = `Dear user, you have been remove subscription successfully`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendVerificationEmail,
  sendSubscribeEmail,
  sendUnsubscribeEmail,
};
