const roundTo = require('round-to');

const padding = (val) => {
  if (isNaN(parseFloat(val))) return '-';
  return roundTo(val, 2).toPrecision(3);
};

const round = (val) => {
  return roundTo(val, 2);
};

module.exports = {
  padding,
  round
};
