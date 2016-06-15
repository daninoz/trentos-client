angular.module('trentos')
    .controller('NavbarCtrl', function ($scope, $auth, $uibModal, $state, toastr) {
      $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
      };

      $scope.openAddEventModal = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/partials/add_event.html',
          controller: 'AddEventCtrl'
        });

        modalInstance.result.then(function () {

        });
      };

      $scope.openLoginModal = function () {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/partials/login.html',
          controller: 'LoginCtrl'
        });

        modalInstance.result.then(function () {
          $state.go('events');
        });
      };

      $scope.logout = function () {
        $auth.logout().then(function () {
          toastr.info('You have been logged out');
          $state.go('home');
        });
      };
    });
