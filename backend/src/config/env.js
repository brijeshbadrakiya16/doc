const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dms_db',
  jwtSecret: process.env.JWT_SECRET || 'fallback_dms',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200'
};
