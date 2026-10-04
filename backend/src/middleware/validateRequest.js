const { BadRequestError } = require('../errors/AppError');

const validateBody = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      const msg = error.errors.map(e => e.message).join('. ');
      return next(new BadRequestError(msg));
    }
    next(new BadRequestError('Invalid request payload'));
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.query);
    req.query = parsed;
    next();
  } catch (error) {
    if (error.errors && Array.isArray(error.errors)) {
      const msg = error.errors.map(e => e.message).join('. ');
      return next(new BadRequestError(msg));
    }
    next(new BadRequestError('Invalid query parameters'));
  }
};

module.exports = {
  validateBody,
  validateQuery
};
