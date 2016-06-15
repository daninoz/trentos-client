angular.module('trentos')
    .controller('HomeCtrl', function($scope, $auth, $location) {

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      if ($auth.isAuthenticated()) {
        $location.path('/events');
      }

    });
