const router = require('express').Router();

router.get('/', (_req, res) => {
  res.render('./index.ejs');
});

module.exports = router;
