const documentService = require('../services/documentService');

const uploadDocument = async (req, res, next) => {
  try {
    const fileDoc = await documentService.handleStreamingUpload(req, req.user._id);
    res.status(201).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: { document: fileDoc }
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const result = await documentService.getDocuments(req.user._id, req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.user._id, req.params.id);
    res.status(200).json({
      status: 'success',
      data: { document }
    });
  } catch (error) {
    next(error);
  }
};

const downloadDocument = async (req, res, next) => {
  try {
    const { file, downloadStream } = await documentService.getDocumentStream(req.user._id, req.params.id);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader('Content-Length', file.size);

    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      if (!res.headersSent) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const result = await documentService.deleteDocument(req.user._id, req.params.id);
    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await documentService.getDashboardStats(req.user._id);
    res.status(200).json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
  getDashboardStats
};
