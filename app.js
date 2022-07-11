require('dotenv').config();
const appConfig = require('./config/application.config');
const dbConfig = require('./config/mysql.config');
const express = require('express');
const path = require('path');
const app = express();
const favicon = require('serve-favicon');
// const chalk = require('chalk');
const logger = require('./lib/log/logger');
const applicationLogger = require('./lib/log/applicationLogger');
const accessLogger = require('./lib/log/accessLogger');
const cookie = require('cookie-parser');
const session = require('express-session');
const MYSQLStore = require('express-mysql-session')(session);

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
  secret: appConfig.security.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sid',
}));
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/account', require('./routes/account'));
app.use('/search', require('./routes/search'));
app.use('/shops', require('./routes/shops'));
app.use(applicationLogger());
app.listen(appConfig.PORT, () => logger.application.info('Express server started!'));
// app.listen(3000, () => logger.application.info(chalk.green('Express server started!')));
// app.listen(3000, () => logger.application.info(chalk.bgGreen('Express server started!')));
