const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../errors/AppError');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check HTTP-only cookie first
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } 
    // Fallback to Authorization Bearer header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token missing. Please log in.');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError('User belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect
};
