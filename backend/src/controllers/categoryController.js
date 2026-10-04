const categoryService = require('../services/categoryService');

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.user._id, req.body);
    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategoriesByUser(req.user._id);
    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.user._id, req.params.id);
    res.status(200).json({
      status: 'success',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.user._id, req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.user._id, req.params.id);
    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
