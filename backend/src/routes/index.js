const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const documentRoutes = require('./documentRoutes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/documents', documentRoutes);

module.exports = router;
