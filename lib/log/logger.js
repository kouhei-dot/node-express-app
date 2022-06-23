const log4js = require('log4js');
const config = require('../../config/log4js.config');
log4js.configure(config);
const console = log4js.getLogger();
const application = log4js.getLogger('application');
const access = log4js.getLogger('access');

module.exports = {
  console,
  application,
  access,
};
