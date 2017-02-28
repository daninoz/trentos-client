(function () {
  'use strict';

  angular
      .module('trentos')
      .factory('authService', authService);

  authService.$inject = ['$auth', '$rootScope', '$http', 'toastr'];
  function authService ($auth, $rootScope, $http, toastr) {
    return {
      passwordAuthenticate: function (vm, $uibModalInstance) {
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
      },
      facebookAuthenticate: function (vm, $uibModalInstance) {
        $auth.authenticate('facebook')
            .then(function () {
              $rootScope.$broadcast('login');
              $http.get('api/me').then(function (response) {
                $rootScope.user = response.data;
              });
              toastr.success('Has ingresado exitosamente con facebook!');
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
      },
      register: function (vm, $uibModalInstance) {
        $http({
          method: 'POST',
          url: 'api/auth/register',
          headers: {
            'Content-Type': undefined
          },
          transformRequest: function (data) {
            var formData = new FormData();
            for (var datum in data) {
              if (data.hasOwnProperty(datum)) {
                formData.append(datum, data[datum]);
              }
            }
            return formData;
          },
          data: vm.user
        }).then(function () {
          $auth.login({email: vm.user.email, password: vm.user.password})
              .then(function () {
                $rootScope.$broadcast('login');
                $http.get('api/me').then(function (response) {
                  $rootScope.user = response.data;
                });
                toastr.success('Te has registrado exitosamente!');
                $uibModalInstance.close();
              });
        })
            .catch(function (error) {
              if (error.status === 422) {
                vm.user.email = '';
                vm.user.email_2 = '';
                vm.form.$setPristine();
                vm.error = 'Ya existe una cuenta creada con ese email.';
              } else if (error.error) {
                toastr.error(error.error);
              } else if (error.data) {
                toastr.error(error.data.message, error.status);
              } else {
                toastr.error(error);
              }
            });
      }
    };
  }
})();

