/* eslint-disable */
const btnSubmitOnClick = function (event) {
  const $submit = $(this);
  const $form = $submit.parents('form');
  $form.attr('method', $submit.data('method'));
  $form.attr('action', $submit.data('action'));
  $form.submit();
};

const documentOnReady = function (event) {
  $("input[type='submit']").on('click', btnSubmitOnClick);
};

$(document).ready(documentOnReady);
