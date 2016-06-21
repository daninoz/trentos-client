(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', '$auth', '$uibModalInstance', 'toastr'];
  function LoginController ($location, $auth, $uibModalInstance, toastr) {
    var vm = this;

    vm.authenticate = authenticate;
    vm.cancel = cancel;

    function authenticate (provider) {
      $auth.authenticate(provider)
          .then(function () {
            toastr.success('You have successfully signed in with ' + provider + '!');
            $uibModalInstance.close();
          })
          .catch(function (error) {
            if (error.error) {
              toastr.error(error.error);
            } else if (error.data) {
              toastr.error(error.data.message, error.status);
            } else {
              toastr.error(error);
            }
          });
    }

    function cancel () {
      $uibModalInstance.dismiss();
    }

  }
})();