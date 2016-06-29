(function () {
  'use strict';

  angular
      .module('trentos', ['satellizer', 'ui.router', 'toastr', 'ngAnimate', 'ui.bootstrap', 'angularMoment', 'chart.js'])
      .config(config)
      .run(runBlock);

  config.$inject = ['$authProvider', '$stateProvider', '$urlRouterProvider', 'toastrConfig'];
  function config ($authProvider, $stateProvider, $urlRouterProvider, toastrConfig) {

    $stateProvider
        .state('home', {
          url: '/',
          controller: 'HomeController',
          controllerAs: 'vm',
          templateUrl: 'app/partials/home.html'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'app/partials/login.html',
          controller: 'LoginController',
          controllerAs: 'vm',
          resolve: {
            skipIfLoggedIn: skipIfLoggedIn
          }
        })
        .state('events', {
          url: '/eventos',
          templateUrl: 'app/partials/events.html',
          controller: 'EventsController',
          controllerAs: 'vm',
          resolve: {
            loginRequired: loginRequired
          }
        })
        .state('sports', {
          url: '/deportes/:sportId',
          templateUrl: 'app/partials/sports.html',
          controller: 'SportsController',
          controllerAs: 'vm',
          resolve: {
            loginRequired: loginRequired
          }
        })
        .state('statistics', {
          url: '/estadisticas',
          templateUrl: 'app/partials/statistics.html',
          controller: 'StatisticsController',
          controllerAs: 'vm',
          resolve: {
            loginRequired: loginRequired
          }
        });

    $urlRouterProvider.otherwise('/');

    $authProvider.facebook({
      clientId: '1040065426062280',
      url: '/api/auth/facebook',
    });

    angular.extend(toastrConfig, {
      positionClass: 'toast-bottom-right'
    });

    function skipIfLoggedIn ($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired ($rootScope, $http, $q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        if (!$rootScope.user) {
          $http.get('api/me').then(function (response) {
            $rootScope.user = response.data;
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }
      } else {
        $state.go('login');
      }
      return deferred.promise;
    }

  }

  runBlock.$inject = ['amMoment'];
  function runBlock (amMoment) {
    amMoment.changeLocale('es');
  }
})();