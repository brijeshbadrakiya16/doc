const Busboy = require('busboy');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const File = require('../models/File');
const User = require('../models/User');
const Category = require('../models/Category');
const { getGridFsBucket } = require('../config/db');
const { validateFileHeader } = require('../utils/magicBytes');
const { MAX_FILE_SIZE_BYTES, MAX_ACTIVE_FILES_PER_USER } = require('../constants/fileConstants');
const { 
  BadRequestError, 
  NotFoundError, 
  ForbiddenError, 
  ConflictError, 
  PayloadTooLargeError 
} = require('../errors/AppError');

/**
 * Handle multipart streaming upload to GridFS with atomic quota reservation and incremental checksum hashing
 */
const handleStreamingUpload = (req, userId) => {
  return new Promise(async (resolve, reject) => {
    let reservedQuota = false;
    let storedFileId = null;
    let uploadStream = null;

    // 1. Reserve quota atomically
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, activeFileCount: { $lt: MAX_ACTIVE_FILES_PER_USER } },
        { $inc: { activeFileCount: 1 } },
        { new: true }
      );

      if (!user) {
        return reject(
          new BadRequestError(
            `Storage quota reached: Maximum ${MAX_ACTIVE_FILES_PER_USER} active files allowed per user. Please delete an existing file first.`
          )
        );
      }
      reservedQuota = true;
    } catch (err) {
      return reject(err);
    }

    const rollbackQuota = async () => {
      if (reservedQuota) {
        try {
          await User.findByIdAndUpdate(userId, { $inc: { activeFileCount: -1 } });
          reservedQuota = false;
        } catch (e) {
          console.error('[Quota Rollback Error]', e);
        }
      }
    };

    const cleanupGridFS = async () => {
      if (storedFileId) {
        try {
          const gridFsBucket = getGridFsBucket();
          await gridFsBucket.delete(storedFileId);
        } catch (e) {
          // Stream might not have written chunks yet
        }
      }
    };

    // Client connection abort handler
    req.on('aborted', async () => {
      if (uploadStream) {
        uploadStream.destroy();
      }
      await cleanupGridFS();
      await rollbackQuota();
      reject(new BadRequestError('Upload request was aborted by the client.'));
    });

    let busboy;
    try {
      busboy = Busboy({
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 }
      });
    } catch (err) {
      await rollbackQuota();
      return reject(new BadRequestError('Failed to parse upload stream header'));
    }

    let fileProcessed = false;
    const fields = {};

    busboy.on('field', (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, fileStream, filenameObj, encoding, mimetype) => {
      fileProcessed = true;

      // Extract and sanitize filename
      const rawName = typeof filenameObj === 'string' ? filenameObj : (filenameObj ? filenameObj.filename : '');
      const reportedMime = typeof filenameObj === 'object' && filenameObj ? filenameObj.mimeType : mimetype;
      
      const originalName = path.basename(rawName || '').replace(/[\r\n\0]/g, '').trim();

      if (!originalName) {
        fileStream.resume(); // Drain stream
        rollbackQuota();
        return reject(new BadRequestError('Uploaded file must have a valid filename'));
      }

      const gridFsBucket = getGridFsBucket();
      storedFileId = new mongoose.Types.ObjectId();
      uploadStream = gridFsBucket.openUploadStreamWithId(storedFileId, originalName);

      const hash = crypto.createHash('sha256');
      let totalBytes = 0;
      let headBuffer = Buffer.alloc(0);
      let sizeExceeded = false;

      fileStream.on('limit', async () => {
        sizeExceeded = true;
        fileStream.unpipe(uploadStream);
        fileStream.resume();
        await cleanupGridFS();
        if (uploadStream) uploadStream.destroy();
        await rollbackQuota();
        reject(
          new PayloadTooLargeError(`File size exceeds maximum allowed limit of 1 MB (${MAX_FILE_SIZE_BYTES} bytes).`)
        );
      });

      fileStream.on('data', (chunk) => {
        totalBytes += chunk.length;

        // Accumulate first 4100 bytes for magic bytes inspection
        if (headBuffer.length < 4100) {
          headBuffer = Buffer.concat([headBuffer, chunk]).subarray(0, 4100);
        }

        if (totalBytes > MAX_FILE_SIZE_BYTES) {
          sizeExceeded = true;
          fileStream.unpipe(uploadStream);
          fileStream.resume(); // Drain
          cleanupGridFS();
          uploadStream.destroy();
          rollbackQuota();
          return reject(
            new PayloadTooLargeError(`File size exceeds maximum allowed limit of 1 MB (${MAX_FILE_SIZE_BYTES} bytes).`)
          );
        }

        hash.update(chunk);
        uploadStream.write(chunk);
      });

      fileStream.on('end', () => {
        if (sizeExceeded) return;
        uploadStream.end();
      });

      fileStream.on('error', async (err) => {
        await cleanupGridFS();
        if (uploadStream) uploadStream.destroy();
        await rollbackQuota();
        reject(err);
      });

      uploadStream.on('finish', async () => {
        if (sizeExceeded) return;

        const checksum = hash.digest('hex');

        // Magic bytes & file extension header validation
        const headerValidation = validateFileHeader(headBuffer, originalName, reportedMime);
        if (!headerValidation.valid) {
          await cleanupGridFS();
          await rollbackQuota();
          return reject(new BadRequestError(headerValidation.reason));
        }

        // Category ownership verification
        let categoryId = null;
        if (fields.categoryId && fields.categoryId.trim() !== '') {
          if (!mongoose.Types.ObjectId.isValid(fields.categoryId)) {
            await cleanupGridFS();
            await rollbackQuota();
            return reject(new BadRequestError('Invalid category ID format.'));
          }

          const cat = await Category.findOne({ _id: fields.categoryId, userId });
          if (!cat) {
            await cleanupGridFS();
            await rollbackQuota();
            return reject(new BadRequestError('Specified category does not exist or does not belong to your workspace.'));
          }
          categoryId = cat._id;
        }

        try {
          const fileDoc = await File.create({
            userId,
            originalName,
            storedFileId,
            size: totalBytes,
            mimeType: headerValidation.mimeType,
            extension: headerValidation.extension,
            checksum,
            categoryId,
            description: fields.description ? fields.description.trim() : ''
          });

          resolve(fileDoc);
        } catch (dbErr) {
          await cleanupGridFS();
          await rollbackQuota();

          if (dbErr.code === 11000) {
            return reject(
              new ConflictError('Duplicate file detected: You have already uploaded this exact file.')
            );
          }
          reject(dbErr);
        }
      });

      uploadStream.on('error', async (err) => {
        await cleanupGridFS();
        await rollbackQuota();
        reject(err);
      });
    });

    busboy.on('finish', async () => {
      if (!fileProcessed) {
        await rollbackQuota();
        reject(new BadRequestError('No file was provided in the upload request.'));
      }
    });

    busboy.on('error', async (err) => {
      await rollbackQuota();
      reject(err);
    });

    req.pipe(busboy);
  });
};

/**
 * List documents with pagination, search, category filter, and upload date sorting
 */
const getDocuments = async (userId, query) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const filter = { userId };

  if (query.categoryId) {
    if (query.categoryId === 'null' || query.categoryId === 'uncategorized') {
      filter.categoryId = null;
    } else if (mongoose.Types.ObjectId.isValid(query.categoryId)) {
      filter.categoryId = query.categoryId;
    }
  }

  if (query.search && query.search.trim() !== '') {
    // Escape special regex characters to prevent regex injection attacks
    const sanitizedSearch = query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(sanitizedSearch, 'i');
    filter.$or = [
      { originalName: searchRegex },
      { description: searchRegex }
    ];
  }

  const sortField = query.sortField || 'uploadDate';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const sortOptions = {};
  sortOptions[sortField] = sortOrder;

  const [documents, totalCount] = await Promise.all([
    File.find(filter)
      .populate('categoryId', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    File.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return {
    documents: documents.map(doc => ({
      ...doc,
      id: doc._id,
      categoryName: doc.categoryId ? doc.categoryId.name : 'Uncategorized'
    })),
    pagination: {
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Get document by ID with user ownership check
 */
const getDocumentById = async (userId, fileId) => {
  const file = await File.findById(fileId).populate('categoryId', 'name').lean();
  if (!file) {
    throw new NotFoundError('Document not found');
  }

  if (file.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have permission to view this document');
  }

  return {
    ...file,
    id: file._id,
    categoryName: file.categoryId ? file.categoryId.name : 'Uncategorized'
  };
};

/**
 * Download document stream from GridFS
 */
const getDocumentStream = async (userId, fileId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new NotFoundError('Document not found');
  }

  if (file.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have permission to download this document');
  }

  const gridFsBucket = getGridFsBucket();
  const downloadStream = gridFsBucket.openDownloadStream(file.storedFileId);

  return {
    file,
    downloadStream
  };
};

/**
 * Delete document, remove GridFS storage, and atomically decrement user activeFileCount
 */
const deleteDocument = async (userId, fileId) => {
  const file = await File.findById(fileId);
  if (!file) {
    throw new NotFoundError('Document not found');
  }

  if (file.userId.toString() !== userId.toString()) {
    throw new ForbiddenError('You do not have permission to delete this document');
  }

  // Delete from GridFS
  const gridFsBucket = getGridFsBucket();
  try {
    await gridFsBucket.delete(file.storedFileId);
  } catch (err) {
    console.error('[GridFS Delete Warning]', err.message);
  }

  // Delete File document
  await File.findByIdAndDelete(fileId);

  // Atomically decrement user active file count
  await User.findByIdAndUpdate(userId, { $inc: { activeFileCount: -1 } });

  return { message: 'Document deleted successfully' };
};

/**
 * Get dashboard statistics for user
 */
const getDashboardStats = async (userId) => {
  const user = await User.findById(userId);
  const totalFiles = user ? user.activeFileCount : 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalSizeResult, categoryCounts, recentUploads, documentsThisMonthCount] = await Promise.all([
    File.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalBytes: { $sum: '$size' } } }
    ]),
    File.aggregate([
      { $match: { userId } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } }
    ]),
    File.find({ userId })
      .populate('categoryId', 'name')
      .sort({ uploadDate: -1 })
      .limit(5)
      .lean(),
    File.countDocuments({
      userId,
      uploadDate: { $gte: startOfMonth }
    })
  ]);

  const totalBytes = totalSizeResult.length > 0 ? totalSizeResult[0].totalBytes : 0;

  const categories = await Category.find({ userId }).lean();
  const catNameMap = {};
  categories.forEach(c => { catNameMap[c._id.toString()] = c.name; });

  const breakdown = categoryCounts.map(item => ({
    categoryId: item._id,
    categoryName: item._id ? (catNameMap[item._id.toString()] || 'Unknown') : 'Uncategorized',
    count: item.count
  }));

  return {
    activeFilesCount: totalFiles,
    totalDocuments: totalFiles,
    documentsThisMonth: documentsThisMonthCount,
    categoryCount: categories.length,
    maxAllowedFiles: MAX_ACTIVE_FILES_PER_USER,
    remainingFilesCount: MAX_ACTIVE_FILES_PER_USER - totalFiles,
    totalSizeBytes: totalBytes,
    totalSizeMB: (totalBytes / (1024 * 1024)).toFixed(2),
    categoryBreakdown: breakdown,
    recentUploads: recentUploads.map(doc => ({
      ...doc,
      id: doc._id,
      categoryName: doc.categoryId ? doc.categoryId.name : 'Uncategorized'
    }))
  };
};

module.exports = {
  handleStreamingUpload,
  getDocuments,
  getDocumentById,
  getDocumentStream,
  deleteDocument,
  getDashboardStats
};
