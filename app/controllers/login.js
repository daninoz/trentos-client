(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$location', '$auth', '$uibModalInstance', '$http', 'toastr'];
  function LoginController ($rootScope, $location, $auth, $uibModalInstance, $http, toastr) {
    var vm = this;

    vm.user = {};
    vm.authenticate = authenticate;
    vm.cancel = cancel;
    vm.clean = clean;

    function authenticate (provider) {
      $auth.login({email: vm.user.email, password: vm.user.password})
          .then(function () {
            $rootScope.$broadcast('login');
            $http.get('api/me').then(function (response) {
              $rootScope.user = response.data;
            });
            toastr.success('Has ingresado exitosamente!');
            $uibModalInstance.close();
          })
          .catch(function (error) {
            if (error.status === 404) {
              vm.user.email = '';
              vm.user.password = '';
              vm.form.$setPristine();
              vm.error = 'El usuario no existe.';
            } else if (error.status === 501) {
              vm.user.password = '';
              vm.form.$setPristine();
              vm.error = 'El password es incorrecto.';
            } else if (error.error) {
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

    function clean () {
      vm.error = null;
    }

  }
})();