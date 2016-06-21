(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$rootScope', '$auth', '$uibModal', '$state', '$http', 'toastr'];
  function NavbarController ($rootScope, $auth, $uibModal, $state, $http, toastr) {
    var vm = this;

    vm.isAuthenticated = isAuthenticated;
    vm.openAddEventModal = openAddEventModal;
    vm.logout = logout;

    getSports();

    function isAuthenticated () {
      return $auth.isAuthenticated();
    }

    function openAddEventModal () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/add_event.html',
        controller: 'AddEventsController',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        debugger;
        $rootScope.$broadcast('newEvent');
      });
    }

    function logout () {
      $auth.logout().then(function () {
        toastr.info('You have been logged out');
        $state.go('home');
      });
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
      });
    }
  }
})();
