const logger = require('./logger').application;

module.exports = () => {
  return (err, _req, _res, next) => {
    logger.error(err.message);
    next(err);
  };
};
