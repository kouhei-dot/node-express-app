const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { mysqlClient, sql } = require('../database/client');
const PRIVILEGE = { normal: 'normal' };

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
      let result;
      try {
        result = await mysqlClient.excuteQuery(await sql('SELECT_USER_BY_EMAIL'), [userName]);
      } catch(e) {
        return done(e);
      }
      if (result.length === 1 && password === result[0].password) {
        const user = {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          permissions: [PRIVILEGE.normal],
        };
        req.session.regenerate((err) => {
          if (err) {
            return done(err);
          } else {
            return done(null, user);
          }
        });
      } else {
        return done(null, false, req.flash('message', 'ユーザー名 または パスワードが間違っています。'));
      }
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
