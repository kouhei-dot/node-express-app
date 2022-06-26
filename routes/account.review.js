const router = require('express').Router();
const { mysqlClient, sql } = require('../lib/database/client');

router.get('/regist/:shopId(\\d+)', async (req, res, next) => {
  const shopId = req.params.shopId;
  try {
    const result = await mysqlClient.excuteQuery(
      await sql('SELECT_SHOP_BASIC_BY_ID'),
      [shopId]
    );
    const shop = result[0] || {};
    const shopName = shop.name;
    const review = {};
    res.render('./account/reviews/regist-form.ejs', { shopId, shopName, review });
  } catch(e) {
    next(e);
  }
});

module.exports = router;
