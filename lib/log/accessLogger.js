const log4js = require('log4js');
const logger = require('./logger').access;
const DEFAULT_LOG_LEVEL = 'auto';

module.exports = (options) => {
  options = options || {};
  options.level = options.level || DEFAULT_LOG_LEVEL;
  return log4js.connectLogger(logger, options);
};
