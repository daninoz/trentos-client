(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$rootScope', 'authService', '$location', '$auth', '$uibModalInstance', '$http', 'toastr'];
  function RegisterController ($rootScope, authService, $location, $auth, $uibModalInstance, $http, toastr) {
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
          authService.facebookAuthenticate(vm, $uibModalInstance);
          break;
      }
    }

    function register () {
      authService.register(vm, $uibModalInstance);
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