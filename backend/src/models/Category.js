const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for category ownership']
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Category description cannot exceed 200 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring category names are unique per user
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
