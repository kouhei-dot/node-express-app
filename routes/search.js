const router = require('express').Router();
const { mysqlClient, sql } = require('../lib/database/client');
const MAX_ITEMS_PER_PAGE = require('../config/application.config').search.MAX_ITEMS_PER_PAGE;

router.get('/', async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const keyword = req.query.keyword || '';
  let result, count;
  try {
    if (keyword) {
      count = (await mysqlClient.excuteQuery(
        await sql('COUNT_SHOP_BY_NAME'),
        [`%${keyword}%`]
      ))[0].count;
      result = await mysqlClient.excuteQuery(
        await sql('SELECT_SHOP_LIST_BY_NAME'),
        [
          `%${keyword}%`,
          (page - 1) * MAX_ITEMS_PER_PAGE,
          MAX_ITEMS_PER_PAGE
        ]
      );
    } else {
      count = MAX_ITEMS_PER_PAGE;
      result = await mysqlClient.excuteQuery(
        await sql('SELECT_SHOP_HIGH_SCORE_LIST'),
        [MAX_ITEMS_PER_PAGE]
      );
    }
  } catch(e) {
    next(e);
  }
  res.render('./search/list.ejs', {
    result,
    count,
    keyword,
    pagination: {
      max: Math.ceil(count / MAX_ITEMS_PER_PAGE),
      current: page,
    },
  });
});

module.exports = router;
