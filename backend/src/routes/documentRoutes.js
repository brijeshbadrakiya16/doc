const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { validateParamId } = require('../middleware/validateObjectId');
const { validateQuery } = require('../middleware/validateRequest');
const { documentQuerySchema } = require('../utils/validators');

router.use(protect);

router.post('/', documentController.uploadDocument);
router.get('/', validateQuery(documentQuerySchema), documentController.getDocuments);
router.get('/stats', documentController.getDashboardStats);
router.get('/:id', validateParamId('id'), documentController.getDocumentById);
router.get('/:id/download', validateParamId('id'), documentController.downloadDocument);
router.delete('/:id', validateParamId('id'), documentController.deleteDocument);

module.exports = router;
