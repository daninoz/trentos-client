(function () {
  'use strict';

  angular
      .module('trentos')
      .factory('userService', userService);

  userService.$inject = ['$rootScope'];
  function userService ($rootScope) {
    return {
      isAuthor: function (userId) {
        if ($rootScope.user && $rootScope.user.id) {
          return $rootScope.user.id === userId;
        }
      },
      isAdmin: function () {
        if ($rootScope.user && $rootScope.user.id) {
          return $rootScope.user.is_admin;
        }
      },
      userSports: function () {
        if ($rootScope.user && $rootScope.user.id) {
          return $rootScope.user.sports
        }

        return [];
      }
    };
  }
})();

