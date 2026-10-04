const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { validateParamId } = require('../middleware/validateObjectId');
const { validateBody } = require('../middleware/validateRequest');
const { categorySchema, categoryUpdateSchema } = require('../utils/validators');

router.use(protect);

router.post('/', validateBody(categorySchema), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', validateParamId('id'), categoryController.getCategoryById);
router.put('/:id', validateParamId('id'), validateBody(categoryUpdateSchema), categoryController.updateCategory);
router.patch('/:id', validateParamId('id'), validateBody(categoryUpdateSchema), categoryController.updateCategory);
router.delete('/:id', validateParamId('id'), categoryController.deleteCategory);

module.exports = router;
