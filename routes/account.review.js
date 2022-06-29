const router = require('express').Router();
const { mysqlClient, sql } = require('../lib/database/client');
const moment = require('moment');
const DATE_FORMAT = 'YYYY/MM/DD';

const createReviewData = (req) => {
  const body = req.body;
  let date;
  return {
    shopId: req.params.shopId,
    score: parseFloat(body.score),
    visit: (date = moment(body.visit, DATE_FORMAT)) && date.isValid() ? date.toDate() : null,
    post: new Date(),
    description: body.description,
  };
};

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

router.post('/regist/:shopId(\\d+)', async (req, res) => {
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;
  res.render('./account/reviews/regist-form.ejs', { shopId, shopName, review });
});

router.post('/regist/confirm', async (req, res) => {
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;
  res.render('./account/reviews/regist-confirm.ejs', { shopId, shopName, review });
});

module.exports = router;
