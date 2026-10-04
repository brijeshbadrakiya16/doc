const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for file ownership']
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true
    },
    storedFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'GridFS stored file ID is required']
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      max: [1048576, 'File size cannot exceed 1 MB (1,048,576 bytes)']
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true
    },
    extension: {
      type: String,
      required: [true, 'File extension is required'],
      lowercase: true,
      trim: true
    },
    checksum: {
      type: String,
      required: [true, 'SHA-256 checksum is required'],
      trim: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index for duplicate upload prevention per user
fileSchema.index({ userId: 1, checksum: 1 }, { unique: true });

// Query indexes for sorting, filtering, and searching
fileSchema.index({ userId: 1, uploadDate: -1 });
fileSchema.index({ userId: 1, categoryId: 1 });
fileSchema.index({ userId: 1, originalName: 1 });

const File = mongoose.model('File', fileSchema);

module.exports = File;
