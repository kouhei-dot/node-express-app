const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { mysqlClient, sql } = require('../database/client');
const bcrypt = require('bcrypt');
const moment = require('moment');
const {
  ACCOUNT_LOCK_WINDOW,
  ACCOUNT_LOCK_THRESHOLD,
  ACCOUNT_LOCK_TIME,
  MAX_LOGIN_HISTORY,
} = require('../../config/application.config').security;
const PRIVILEGE = { normal: 'normal' };
const LOGIN_STATUS = {
  SUCCESS: 0,
  FAILURE: 1,
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  'local-strategy',
  new LocalStrategy(
    {
      usernameField: 'userName',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, userName, password, done) => {
      let user;
      try {
        const tran = await mysqlClient.beginTransaction();
        const result = await tran.excuteQuery(
          await sql('SELECT_USER_BY_EMAIL_FOR_UPDATE'),
          [userName]
        );
        if (result.length !== 1) {
          await tran.commit();
          return done(null, false, req.flash('message', 'ユーザー名 または パスワードが間違っています。'));
        }
        user = {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          permissions: [PRIVILEGE.normal],
        };
        const now = new Date();
        if (result[0].locked
          && moment(now).isSameOrBefore(
            moment(result[0].locked).add(ACCOUNT_LOCK_TIME, 'minutes')
          ))
        {
          await tran.commit();
          return done(null, false, req.flash('message', 'アカウントがロックされています。'));
        }
        try {
          await tran.excuteQuery(
            await sql('DELETE_LOGIN_HISTORY'),
            [user.id, user.id, MAX_LOGIN_HISTORY - 1]
          );
          if (!await bcrypt.compare(password, result[0].password)) {
            await tran.excuteQuery(
              await sql('INSERT_LOGIN_HISTORY'),
              [user.id, now, LOGIN_STATUS.FAILURE]
            );
            const failCount = await tran.excuteQuery(
              await sql('COUNT_LOGIN_HISTORY'),
              [
                user.id,
                moment(now).subtract(ACCOUNT_LOCK_WINDOW, 'minutes').toDate(),
                LOGIN_STATUS.FAILURE,
              ]
            ) || [];
            if (failCount[0].count >= ACCOUNT_LOCK_THRESHOLD) {
              await tran.excuteQuery(await sql('UPDATE_USER_LOCKED'), [now, user.id]);
            }
            await tran.commit();
            return done(null, false, req.flash('message', 'ユーザー名 または パスワードが間違っています。'));
          } else {
            await tran.excuteQuery(
              await sql('INSERT_LOGIN_HISTORY'),
              [user.id, now, LOGIN_STATUS.SUCCESS]
            );
            await tran.excuteQuery(await sql('UPDATE_USER_LOCKED'), [null, user.id]);
          }
          await tran.commit();
        } catch(e) {
          await tran.rollback();
          return done(e);
        }
      } catch(e) {
        return done(e);
      }
      req.session.regenerate((err) => {
        if (err) {
          return done(err);
        } else {
          return done(null, user);
        }
      });
    }
  )
);

const initialize = () => {
  return [
    passport.initialize(),
    passport.session(),
    (req, res, next) => {
      if (req.user) {
        res.locals.user = req.user;
      }
      next();
    }
  ];
};

const authenticate = () => {
  return passport.authenticate(
    'local-strategy',
    {
      successRedirect: '/account',
      failureRedirect: '/account/login',
    }
  );
};

const authrorize = (privilege) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && (req.user.permissions || []).includes(privilege)) {
      next();
    } else {
      res.redirect('/account/login');
    }
  };
};

module.exports = {
  initialize,
  authenticate,
  authrorize,
  PRIVILEGE,
};
