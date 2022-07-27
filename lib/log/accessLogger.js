const log4js = require('log4js');
const logger = require('./logger').access;
const DEFAULT_LOG_LEVEL = 'auto';

module.exports = (options) => {
  options = options || {};
  options.level = options.level || DEFAULT_LOG_LEVEL;
  options.format = options.format || function (req, res, format) {
    const address = req['x-forwarded-for'] || req.ip;
    return format(`${address.replace(/(\.|:)\d+(,|$)/g, '$10$2')} :method :url HTTP/:http-version :status :response-time :user-agent`);
  };
  return log4js.connectLogger(logger, options);
};
