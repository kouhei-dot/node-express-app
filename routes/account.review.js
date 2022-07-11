const router = require('express').Router();
const { mysqlClient, sql } = require('../lib/database/client');
const moment = require('moment');
const DATE_FORMAT = 'YYYY/MM/DD';
const { validationResult, body } = require('express-validator');

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

router.post('/regist/confirm', [body('visit').isDate()], async (req, res) => {
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errors = error.array();
    res.render('./account/reviews/regist-form.ejs', { errors, shopId, shopName, review });
    return;
  }
  res.render('./account/reviews/regist-confirm.ejs', { shopId, shopName, review });
});

router.post('/regist/excute', async (req, res, next) => {
  const review = createReviewData(req);
  const { shopId, shopName } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errors = error.array();
    res.render('./account/reviews/regist-form.ejs', { errors, shopId, shopName, review });
    return;
  }
  // TODO ログイン機能実装時に実装する
  const userId = 1;
  const tran =  await mysqlClient.beginTransaction();
  try {
    await tran.excuteQuery(await sql('SELECT_SHOP_BY_ID_FOR_UPDATE'), [shopId]);
    await tran.excuteQuery(await sql('INSERT_SHOP_REVIEW'), [
      shopId, userId, review.score, review.visit, review.description
    ]);
    await tran.excuteQuery(await sql('UPDATE_SHOP_SCORE_BY_ID'), [shopId, shopId]);
    await tran.commit();
  } catch(e) {
    tran.rollback();
    next(e);
    return;
  }
  res.render('./account/reviews/regist-complete.ejs', { shopId });
});

module.exports = router;
