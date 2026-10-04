const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true
    },
    activeFileCount: {
      type: Number,
      default: 0,
      min: [0, 'Active file count cannot be negative'],
      max: [20, 'Maximum active files per user cannot exceed 20']
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
