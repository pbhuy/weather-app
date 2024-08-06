const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const { toJSON } = require('./plugins');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
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
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

userSchema.plugin(toJSON);

const User = mongoose.model('User', userSchema);

module.exports = User;
