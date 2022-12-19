import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  node_env: process.env.NODE_ENV || 'development',
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  emails: {
    sender: process.env.AZURE_EMAIL_SENDER,
    azure_connection_string: process.env.AZURE_EMAIL_CONNECTION_STRING,
  },

  maps: {
    apiKey: process.env.GOOGLE_CLOUD_MAPS_API_KEY,
  },

  cache: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
};
