(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('NavbarController', NavbarController);

  NavbarController.$inject = ['$rootScope', '$auth', '$uibModal', '$state', '$http', 'toastr'];
  function NavbarController ($rootScope, $auth, $uibModal, $state, $http, toastr) {
    var vm = this;

    vm.isNavCollapsed = true;
    vm.isAuthenticated = isAuthenticated;
    vm.isAdmin = isAdmin;
    vm.openAddEventModal = openAddEventModal;
    vm.openManageSportsModal = openManageSportsModal;
    vm.openLoginModal = openLoginModal;
    vm.openRegisterModal = openRegisterModal;
    vm.logout = logout;

    getSports();
    $rootScope.$on('login', getSports);

    function isAuthenticated () {
      return $auth.isAuthenticated();
    }

    function isAdmin () {
      return $rootScope.user && $rootScope.user.is_admin;
    }

    function openAddEventModal () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/add_event.html',
        controller: 'AddEventsController',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        $rootScope.$broadcast('eventsUpdated');
      });
    }

    function openManageSportsModal () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/manage_sports.html',
        controller: 'ManageSportsController',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        $state.go('feed', undefined, {reload: true});
      });
    }

    function openLoginModal () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        $state.go('feed');
      });
    }

    function openRegisterModal () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        $state.go('events');
      });
    }

    function logout () {
      $auth.logout().then(function () {
        toastr.info('Has cerrado sesion');
        $state.go('events');
      });
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
      });
    }
  }
})();
