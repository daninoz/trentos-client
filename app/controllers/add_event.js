(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('AddEventsController', AddEventsController);

  AddEventsController.$inject = ['$uibModalInstance', '$http'];
  function AddEventsController ($uibModalInstance, $http) {
    var vm = this;

    vm.event = {};
    vm.cancel = cancel;
    vm.add = add;
    vm.openDatePopup = openDatePopup;

    getSports();
    setDateConfig();

    function cancel () {
      $uibModalInstance.dismiss();
    }

    function add () {
      $http.post('/api/events', vm.event).then(function () {
        $uibModalInstance.close();
      });
    }

    function openDatePopup () {
      vm.datePopup.opened = true;
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
      });
    }

    function setDateConfig () {
      vm.dateFormat = 'dd/MM/yyyy';
      vm.datePopup = {
        opened: false
      };
      vm.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };
    }

  }
})();