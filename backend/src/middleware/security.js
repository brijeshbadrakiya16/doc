const helmet = require('helmet');
const cors = require('cors');
const env = require('../config/env');

const configureSecurityMiddleware = (app) => {
  // Helmet HTTP security headers
  app.use(helmet({
    contentSecurityPolicy: false, // allow Angular inline scripts in development
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }));

  // CORS restricted to configured frontend origin
  app.use(cors({
    origin: [env.frontendOrigin, 'http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));
};

module.exports = {
  configureSecurityMiddleware
};
