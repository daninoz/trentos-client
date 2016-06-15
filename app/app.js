angular.module('trentos', ['satellizer', 'ui.router', 'toastr', 'ngAnimate', 'ui.bootstrap', 'angularMoment'])
    .config(function ($authProvider, $stateProvider, $urlRouterProvider, toastrConfig) {

      $stateProvider
          .state('home', {
            url: '/',
            controller: 'HomeCtrl',
            templateUrl: 'app/partials/home.html'
          })
          .state('login', {
            url: '/login',
            templateUrl: 'app/partials/login.html',
            controller: 'LoginCtrl',
            resolve: {
              skipIfLoggedIn: skipIfLoggedIn
            }
          })
          .state('events', {
            url: '/events',
            templateUrl: 'app/partials/events.html',
            controller: 'EventsCtrl',
            resolve: {
              loginRequired: loginRequired
            }
          });

      $urlRouterProvider.otherwise('/');

      $authProvider.facebook({
        clientId: '1040065426062280'
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

      function loginRequired ($q, $location, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.resolve();
        } else {
          $location.path('/login');
        }
        return deferred.promise;
      }

    })
    .run(function (amMoment) {
      amMoment.changeLocale('es');
    });

