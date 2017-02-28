(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', 'authService', '$uibModalInstance'];
  function LoginController ($rootScope, authService, $uibModalInstance) {
    var vm = this;

    vm.user = {};
    vm.authenticate = authenticate;
    vm.cancel = cancel;
    vm.clean = clean;

    function authenticate (provider) {
      switch (provider) {
        case 'facebook':
          authService.facebookAuthenticate(vm, $uibModalInstance);
          break;
        default:
          authService.passwordAuthenticate(vm, $uibModalInstance);
          break;
      }
    }

    function cancel () {
      $uibModalInstance.dismiss();
    }

    function clean () {
      vm.error = null;
    }

  }
})();