const crypto = require('crypto');

// Controlled collection of professional, lightly humorous messages
const getLogMessage = (method, url, status) => {
  const isDoc = url.includes('/documents');
  const isCat = url.includes('/categories');
  const isAuth = url.includes('/auth');
  const isHealth = url.includes('/health');

  if (status >= 200 && status < 300) {
    if (isHealth) return 'Heartbeat steady. All systems nominal.';
    if (method === 'GET') {
      if (isDoc && url.includes('/download')) return 'Streaming file bytes to client. Delivery in progress.';
      if (isDoc && url.includes('/stats')) return 'Telemetry calculated. Numbers look healthy.';
      if (isDoc) return 'Document catalog retrieved. Everything seems nicely organized.';
      if (isCat) return 'Categories loaded. Workspace hierarchy confirmed.';
      if (isAuth && url.includes('/me')) return 'Session verified. Welcome back.';
      return 'Data retrieved successfully. No documents were harmed.';
    }
    if (method === 'POST') {
      if (isDoc) return 'New document arrived safely and stored in GridFS.';
      if (isCat) return 'Category established. Order brought to the workspace.';
      if (isAuth && url.includes('/signup')) return 'New user registered. A warm welcome to the database.';
      if (isAuth && url.includes('/login')) return 'Credentials approved. Security clearance granted.';
      if (isAuth && url.includes('/logout')) return 'Session terminated cleanly. Door locked behind.';
      return 'Record created successfully. Another item joins the collection.';
    }
    if (method === 'PUT' || method === 'PATCH') {
      return 'Record refreshed. Changes recorded without a hitch.';
    }
    if (method === 'DELETE') {
      if (isDoc) return 'Document deleted. Storage space reclaimed.';
      if (isCat) return 'Category removed. Associated files moved to Uncategorized.';
      return 'Clean space, happy database.';
    }
    return 'Operation completed smoothly.';
  }

  if (status === 400) {
    if (isDoc && url.includes('quota')) return 'Storage quota limit reached. Maximum 20 files allowed.';
    return 'Validation check caught an issue. Request safely rejected.';
  }
  if (status === 401) {
    return 'Authentication required. The API would like to know who you are.';
  }
  if (status === 403) {
    return 'Access denied. That resource belongs to someone else.';
  }
  if (status === 404) {
    return 'Resource not found. Destination appears to have gone exploring.';
  }
  if (status === 409) {
    return 'Duplicate conflict detected. Identical file fingerprint already exists.';
  }
  if (status === 413) {
    return 'File too large. Kept strictly within the 1 MB ceiling.';
  }
  if (status === 429) {
    return 'Rate limit active. Even the server needs a quick breath.';
  }
  if (status >= 500) {
    return 'Something went sideways on the server. Investigating.';
  }

  return 'Request processed.';
};

const formatTime = (date) => {
  return date.toTimeString().split(' ')[0];
};

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const requestId = 'req_' + crypto.randomBytes(3).toString('hex');
  req.id = requestId;

  // Set request ID header for tracing
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = formatTime(new Date());
    const method = req.method.padEnd(6);
    const path = req.originalUrl || req.url;
    const status = res.statusCode;

    // Identify user safely
    let userIdentifier = 'Guest';
    if (req.user) {
      userIdentifier = `user:${req.user.name || req.user.email || req.user._id}`;
    }

    const message = getLogMessage(req.method, path, status);

    // Color indicators for terminals
    let statusFormatted = `${status}`;
    if (process.stdout.isTTY) {
      if (status >= 200 && status < 300) {
        statusFormatted = `\x1b[32m${status}\x1b[0m`; // Green
      } else if (status >= 400 && status < 500) {
        statusFormatted = `\x1b[33m${status}\x1b[0m`; // Yellow
      } else if (status >= 500) {
        statusFormatted = `\x1b[31m${status}\x1b[0m`; // Red
      }
    }

    console.log(
      `${timestamp} | ${requestId} | ${method.trim()} | ${path} | ${userIdentifier} | ${statusFormatted} | ${duration}ms | "${message}"`
    );
  });

  next();
};

module.exports = requestLogger;
