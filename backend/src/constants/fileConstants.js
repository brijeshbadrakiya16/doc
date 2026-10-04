const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB limit
const MAX_ACTIVE_FILES_PER_USER = 20;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg'
];

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.png',
  '.jpg',
  '.jpeg'
];

const EXTENSION_MIME_MAP = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
};

module.exports = {
  MAX_FILE_SIZE_BYTES,
  MAX_ACTIVE_FILES_PER_USER,
  ALLOWED_MIME_TYPES,
  ALLOWED_EXTENSIONS,
  EXTENSION_MIME_MAP
};
