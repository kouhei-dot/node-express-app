require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production';
const appConfig = require('./config/application.config');
const dbConfig = require('./config/mysql.config');
const express = require('express');
const path = require('path');
const app = express();
const favicon = require('serve-favicon');
const logger = require('./lib/log/logger');
const applicationLogger = require('./lib/log/applicationLogger');
const accessLogger = require('./lib/log/accessLogger');
const accessControl = require('./lib/security/accessControl');
const cookie = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const MYSQLStore = require('express-mysql-session')(session);
const gracefulShutdown = require('http-graceful-shutdown');

app.disable('x-powered-by');

app.use((_req, res, next) => {
  res.locals.moment = require('moment');
  res.locals.padding = require('./lib/math/math').padding;
  next();
});

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(accessLogger());
app.use(cookie());
app.use(session({
  store: new MYSQLStore({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
  }),
  cookie: { secure: isProduction },
  secret: appConfig.security.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sid',
}));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(...accessControl.initialize());

app.use('/', (() => {
  const router = express.Router();
  router.use((_req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });
  router.use('/account', require('./routes/account'));
  router.use('/search', require('./routes/search'));
  router.use('/shops', require('./routes/shops'));
  router.use('/', require('./routes/index'));
  return router;
})());
app.use(applicationLogger());

app.use((_req, res) => {
  res.status(404);
  res.render('./404.ejs');
});

// eslint-disable-next-line no-unused-vars
app.use((_err, _req, res, _next) => {
  res.status(500);
  res.render('./500.ejs');
});
const server = app.listen(appConfig.PORT, () => logger.application.info('Express server started!'));

gracefulShutdown(server, {
  signals: 'SIGINT SIGTERM',
  timeout: 10000,
  onShutdown: () => {
    return new Promise((resolve, reject) => {
      const { pool } = require('./lib/database/pool');
      pool.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },
  finally: () => {
    const logger = require('./lib/log/logger').application;
    logger.info('Application shutdown finished.');
  },
});
