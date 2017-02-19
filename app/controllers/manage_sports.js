(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('ManageSportsController', ManageSportsController);

  ManageSportsController.$inject = ['$rootScope', '$uibModalInstance', '$http', 'toastr'];
  function ManageSportsController ($rootScope, $uibModalInstance, $http, toastr) {
    var vm = this;

    vm.user = {
      sports: []
    };
    vm.selectedSports = [];
    vm.update = update;
    vm.cancel = cancel;
    vm.toggleSports = toggleSports;

    getSports();

    function update () {
      $http.put('/api/me/sports', vm.user).then(function () {
        $uibModalInstance.close();
      });
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
        vm.sports.forEach(function (sport) {
          vm.selectedSports[sport.id] = false;
        });
        $rootScope.user.sports.forEach(function (sport) {
          vm.selectedSports[sport.id] = true;
          vm.toggleSports(sport.id);
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
  }
})();