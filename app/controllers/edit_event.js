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

    getSports();

    function cancel () {
      $uibModalInstance.dismiss();
    }

    function edit () {
      $http.put('/api/events/' + eventId, vm.event).then(function () {
        $uibModalInstance.close();
      });
    }

    function getEvent () {
      $http.get('/api/events/' + eventId).then(function (response) {
        vm.event = response.data;
        vm.event.sport_id = vm.event.sport.id;
        delete vm.event.sport;
      });
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
        getEvent();
      });
    }

    function getSportById (id) {
      return vm.sports.filter(function (sport) {
        return sport.id === id;
      })[0];
    }

  }
})();