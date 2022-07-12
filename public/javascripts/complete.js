/* eslint-disable */
const windowOnPopState = function () {
  history.pushState(null, null, null);
};

const documentOnReady = function () {
  history.pushState(null, null, null);
  $(window).on('popstate', windowOnPopState);
};

$(document).ready(documentOnReady);
