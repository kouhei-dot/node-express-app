module.exports = {
  HOST: process.env.HOST,
  PORT: process.env.DB_PORT,
  USERNAME: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  CONNECTION_LIMIT: process.env.CONNECTION_LIMIT ? parseInt(process.env.CONNECTION_LIMIT) : 10,
  QUEUE_LIMIT: process.env.QUEUE_LIMIT ? parseInt(process.env.QUEUE_LIMIT) : 0,
};
