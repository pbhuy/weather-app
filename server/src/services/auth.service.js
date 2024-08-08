const httpStatus = require('http-status');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/token');
const { Email } = require('../models');

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = verifyToken(verifyEmailToken);
    const existedEmail = await Email.findOne({ email: verifyEmailTokenDoc.email });
    if (!existedEmail) {
      const email = new Email({
        email: verifyEmailTokenDoc.email,
        isVerified: true,
      });
      await email.save();
    }
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  verifyEmail,
};
