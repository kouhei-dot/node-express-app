const router = require('express').Router();
const { mysqlClient, sql } = require('../lib/database/client');

router.get('/:id', async (req, res, next) => {
  Promise.all([
    mysqlClient.excuteQuery(await sql('SELECT_SHOP_DETAIL_BY_ID'), [req.params.id]),
    mysqlClient.excuteQuery(await sql('SELECT_SHOP_REVIEW_BY_SHOP_ID'), [req.params.id]),
  ])
  .then((result) => {
    const data = result[0][0];
    data.reviews = result[1] || [];
    res.render('./shops/index.ejs', data);
  })
  .catch((e) => {
    next(e);
  });
});

module.exports = router;
