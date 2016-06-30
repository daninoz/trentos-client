(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('EditEventsController', EditEventsController);

  EditEventsController.$inject = ['eventId', '$uibModalInstance', '$http'];
  function EditEventsController (eventId, $uibModalInstance, $http) {
    var vm = this;

    vm.cancel = cancel;
    vm.edit = edit;
    vm.openDatePopup = openDatePopup;

    getSports();
    setDateConfig();

    function cancel () {
      $uibModalInstance.dismiss();
    }

    function edit () {
      $http.put('/api/events/' + eventId, vm.event).then(function () {
        $uibModalInstance.close();
      });
    }

    function openDatePopup () {
      vm.datePopup.opened = true;
    }

    function getEvent () {
      $http.get('/api/events/' + eventId).then(function (response) {
        vm.event = response.data;
        vm.event.sport_id = vm.event.sport.id;
        delete vm.event.sport;
        vm.event.date = new Date(vm.event.date);
      });
    }

    function getSportById (id) {
      return vm.sports.filter(function (sport) {
        return sport.id === id;
      })[0];
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
        getEvent();
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