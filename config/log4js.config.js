const path = require('path');
const LOG_ROOT_DIR = process.env.LOG_ROOT_DIR || path.join(__dirname, '../logs');

module.exports = {
  appenders: {
    consoleLogAppender: {
      type: 'console',
    },
    applicationLogAppender: {
      type: 'datefile',
      filename: path.join(LOG_ROOT_DIR, './application.log'),
      pattern: 'yyyyMMdd',
      keepFileExt: true,
      numBackups: 7,
    },
    accessLogAppender: {
      type: 'datefile',
      filename: path.join(LOG_ROOT_DIR, './access.log'),
      pattern: 'yyyyMMdd',
      keepFileExt: true,
      numBackups: 7,
    },
  },
  categories: {
    default: {
      appenders: ['consoleLogAppender'],
      level: 'ALL',
    },
    application: {
      appenders: ['applicationLogAppender', 'consoleLogAppender'],
      level: 'INFO',
    },
    access: {
      appenders: ['accessLogAppender', 'consoleLogAppender'],
      level: 'INFO',
    }
  },
};
