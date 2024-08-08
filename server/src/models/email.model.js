const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const { toJSON } = require('./plugins');

const emailSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

emailSchema.plugin(toJSON);

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
