const mongoose = require('mongoose');
const env = require('./env');

let gridFsBucket = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      autoIndex: true
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    
    // Initialize GridFS bucket
    const db = mongoose.connection.db;
    gridFsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'fs'
    });
    console.log('[GridFS] Bucket initialized ("fs")');

    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failure: ${error.message}`);
    throw error;
  }
};

const getGridFsBucket = () => {
  if (!gridFsBucket) {
    if (mongoose.connection && mongoose.connection.db) {
      gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'fs'
      });
    } else {
      throw new Error('Database not connected. GridFSBucket is unavailable.');
    }
  }
  return gridFsBucket;
};

module.exports = {
  connectDB,
  getGridFsBucket
};
