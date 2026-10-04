const Category = require('../models/Category');
const File = require('../models/File');
const { NotFoundError, ForbiddenError, ConflictError, BadRequestError } = require('../errors/AppError');

const createCategory = async (userId, { name, description }) => {
  const existingCategory = await Category.findOne({ userId, name: name.trim() });
  if (existingCategory) {
    throw new ConflictError(`Category '${name}' already exists in your workspace.`);
  }

  const category = await Category.create({
    userId,
    name: name.trim(),
    description: description ? description.trim() : ''
  });

  return category;
};

const getCategoriesByUser = async (userId) => {
  const categories = await Category.find({ userId }).sort({ name: 1 }).lean();

  // Aggregate file counts per category for the user
  const fileCounts = await File.aggregate([
    { $match: { userId } },
    { $group: { _id: '$categoryId', count: { $sum: 1 } } }
  ]);

  const countMap = {};
  fileCounts.forEach(item => {
    const catId = item._id ? item._id.toString() : 'uncategorized';
    countMap[catId] = item.count;
  });

  return categories.map(cat => ({
    ...cat,
    id: cat._id,
    fileCount: countMap[cat._id.toString()] || 0
  }));
};

const getCategoryById = async (userId, categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new NotFoundError('Category not found');
  }

  if (category.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have access to this category');
  }

  return category;
};

const updateCategory = async (userId, categoryId, { name, description }) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new NotFoundError('Category not found');
  }

  if (category.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have access to this category');
  }

  if (name && name.trim() !== category.name) {
    const existing = await Category.findOne({ userId, name: name.trim() });
    if (existing) {
      throw new ConflictError(`Category name '${name}' already exists.`);
    }
    category.name = name.trim();
  }

  if (description !== undefined) {
    category.description = description.trim();
  }

  await category.save();
  return category;
};

const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new NotFoundError('Category not found');
  }

  if (category.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have access to this category');
  }

  // Set categoryId to null on associated files
  await File.updateMany({ userId, categoryId }, { $set: { categoryId: null } });

  await Category.findByIdAndDelete(categoryId);
  return { message: 'Category deleted successfully' };
};

module.exports = {
  createCategory,
  getCategoriesByUser,
  getCategoryById,
  updateCategory,
  deleteCategory
};
