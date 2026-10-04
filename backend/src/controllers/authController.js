const authService = require('../services/authService');
const env = require('../config/env');

const signup = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);

    // Set HTTP-only auth cookie
    res.cookie('jwt', result.token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie('jwt', result.token, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await authService.getCurrentUserProfile(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        user: profile
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'lax'
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout
};
