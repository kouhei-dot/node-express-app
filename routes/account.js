const router = require('express').Router();
router.use('/reviews', require('./account.review'));
module.exports = router;
