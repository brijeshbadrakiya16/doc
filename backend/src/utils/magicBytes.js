const path = require('path');
const { ALLOWED_EXTENSIONS, EXTENSION_MIME_MAP } = require('../constants/fileConstants');

/**
 * Validates file magic bytes against buffer head
 * @param {Buffer} buffer - First 4100 bytes of the file
 * @param {string} originalName - Original filename
 * @param {string} reportedMime - Browser/client supplied MIME type
 */
const validateFileHeader = (buffer, originalName, reportedMime) => {
  const ext = path.extname(originalName).toLowerCase();
  
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, reason: `Extension '${ext}' is not allowed.` };
  }

  const expectedMime = EXTENSION_MIME_MAP[ext];

  // Magic Bytes Check for PNG, JPEG, PDF
  if (buffer && buffer.length >= 4) {
    // PNG: 89 50 4E 47
    if (ext === '.png' && !(buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47)) {
      return { valid: false, reason: 'File content does not match PNG signature.' };
    }

    // JPEG: FF D8 FF
    if ((ext === '.jpg' || ext === '.jpeg') && !(buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)) {
      return { valid: false, reason: 'File content does not match JPEG signature.' };
    }

    // PDF: %PDF (25 50 44 46)
    if (ext === '.pdf' && !(buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46)) {
      return { valid: false, reason: 'File content does not match PDF signature.' };
    }

    // ZIP / OOXML (DOCX, XLSX): PK (50 4B 03 04)
    if ((ext === '.docx' || ext === '.xlsx') && !(buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04)) {
      return { valid: false, reason: 'File content does not match DOCX/XLSX signature.' };
    }
  }

  return {
    valid: true,
    extension: ext,
    mimeType: expectedMime || reportedMime
  };
};

module.exports = {
  validateFileHeader
};
