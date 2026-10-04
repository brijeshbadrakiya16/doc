const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/db');

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.port, () => {
      console.log(`[DMS Server] Running in ${env.nodeEnv} mode on port ${env.port}`);
    });

    const handleShutdown = (signal) => {
      console.log(`[DMS Server] Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('[DMS Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error(`[DMS Server Failure] Initialization failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
