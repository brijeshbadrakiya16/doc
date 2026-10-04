const argon2 = require('argon2');

const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1
  });
};

const verifyPassword = async (hash, password) => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    return false;
  }
};

module.exports = {
  hashPassword,
  verifyPassword
};
