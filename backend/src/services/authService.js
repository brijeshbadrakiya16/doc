const User = require('../models/User');
const Category = require('../models/Category');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');
const { UnauthorizedError, ConflictError } = require('../errors/AppError');

const DEFAULT_CATEGORIES = ['Contracts', 'Invoices', 'Reports', 'HR', 'Other'];

const registerUser = async ({ email, password, name }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('A user with this email address already exists');
  }

  const passwordHash = await hashPassword(password);
  const newUser = await User.create({
    email,
    passwordHash,
    name,
    activeFileCount: 0
  });

  // Seed default workspace categories for the new user
  try {
    const categoriesToCreate = DEFAULT_CATEGORIES.map(catName => ({
      userId: newUser._id,
      name: catName,
      description: `Default ${catName} category`
    }));
    await Category.insertMany(categoriesToCreate, { ordered: false });
  } catch (err) {
    console.error('[Default Category Seed Warning]', err.message);
  }

  const token = generateToken({ id: newUser._id, email: newUser.email });

  return {
    user: {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      activeFileCount: newUser.activeFileCount
    },
    token
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isValidPassword = await verifyPassword(user.passwordHash, password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken({ id: user._id, email: user.email });

  return {
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      activeFileCount: user.activeFileCount
    },
    token
  };
};

const getCurrentUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthorizedError('User profile not found');
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    activeFileCount: user.activeFileCount,
    createdAt: user.createdAt
  };
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUserProfile
};
