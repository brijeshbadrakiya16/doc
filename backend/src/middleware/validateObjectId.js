const { isValidObjectId } = require('../utils/objectId');
const { BadRequestError } = require('../errors/AppError');

const validateParamId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!id || !isValidObjectId(id)) {
    return next(new BadRequestError(`Invalid identifier format for parameter '${paramName}'`));
  }
  next();
};

module.exports = {
  validateParamId
};
