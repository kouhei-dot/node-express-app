const router = require('express').Router();
const { authenticate, authrorize, PRIVILEGE } = require('../lib/security/accessControl');

router.get('/', authrorize(PRIVILEGE.normal), (_req, res) => {
  res.render('./account/index.ejs');
});

router.get('/login', (req, res) => {
  res.render('./account/login.ejs', { message: req.flash('message') });
});

router.post('/login', authenticate());

router.use('/reviews', authrorize(PRIVILEGE.normal), require('./account.review'));
module.exports = router;
