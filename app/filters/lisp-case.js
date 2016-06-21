(function () {
  'use strict';

  angular
      .module('trentos')
      .filter('lispCase', LispCase);

  function LispCase () {
    return function (input) {
      return input.toLowerCase().replace(new RegExp(' ', 'g'), '-');
    };
  }
})();

