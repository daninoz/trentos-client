(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$location', '$auth', '$uibModalInstance', '$http', 'toastr'];
  function LoginController ($rootScope, $location, $auth, $uibModalInstance, $http, toastr) {
    var vm = this;

    vm.authenticate = authenticate;
    vm.cancel = cancel;

    function authenticate (provider) {
      $auth.authenticate(provider)
          .then(function () {
            $rootScope.$broadcast('login');
            $http.get('api/me').then(function (response) {
              $rootScope.user = response.data;
            });
            toastr.success('Has ingresado exitosamente con ' + provider + '!');
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