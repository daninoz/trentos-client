(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$rootScope', '$location', '$auth', '$uibModalInstance', '$http', 'toastr'];
  function RegisterController ($rootScope, $location, $auth, $uibModalInstance, $http, toastr) {
    var vm = this;

    vm.user = {
      sports: []
    };
    vm.selectedSports = [];
    vm.register = register;
    vm.authenticate = authenticate;
    vm.cancel = cancel;
    vm.toggleSports = toggleSports;

    getSports();

    function authenticate (provider) {
      switch (provider) {
        case 'facebook':
          facebookAuthenticate();
          break;
      }
    }
    function facebookAuthenticate () {
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
    }

    function register (provider) {
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

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
        vm.sports.forEach(function (sport) {
          vm.selectedSports[sport.id] = false;
        });
      });
    }

    function cancel () {
      $uibModalInstance.dismiss();
    }

    function toggleSports (id) {
      var index = vm.user.sports.indexOf(id);

      if (index === -1) {
        vm.user.sports.push(id);
      } else {
        vm.user.sports.splice(index, 1);
      }

      vm.sportsString = vm.user.sports.length ? '1' : '';
      vm.form.selectedSports.$setDirty();
    }

    $rootScope.$on('BrowseFile:Selection', function (event, files) {
      $rootScope.$apply(function () {
        vm.user.avatar = files[0];
      });
    });

  }
})();