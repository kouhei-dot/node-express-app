const router = require('express').Router();
const { authenticate, authrorize, PREVILEGE } = require('../lib/security/accessControl');

router.get('/', (_req, res) => {
  res.render('./account/index.ejs');
});

router.get('/login', (req, res) => {
  res.render('./account/login.ejs', { message: req.flash('message') });
});

router.post('/login', authenticate());

router.use('/reviews', require('./account.review'));
module.exports = router;
