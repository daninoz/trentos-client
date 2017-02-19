(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('HomeController', HomeController);

  HomeController.$inject = ['$auth', '$uibModal', '$state'];
  function HomeController ($auth, $uibModal, $state) {
    var vm = this;

    vm.isAuthenticated = isAuthenticated;
    vm.openLoginModal = openLoginModal;

    function isAuthenticated () {
      return $auth.isAuthenticated();
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

    if ($auth.isAuthenticated()) {
      $state.go('feed');
    }

  }
})();