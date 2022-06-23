
const path = require('path');
const { sql } = require('@garafu/mysql-fileloader')({ root: path.join(__dirname, './sql') });
const pool = require('./pool');
const Transaction = require('./transaction');

const mysqlClient = {
  excuteQuery: async (query, values) => {
    const results = await pool.excuteQuery(query, values);
    return results;
  },
  beginTransaction: async () => {
    const tran = new Transaction();
    await tran.begin();
    return tran;
  },
};

module.exports = {
  mysqlClient,
  sql,
};
