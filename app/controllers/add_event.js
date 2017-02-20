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

    getSports();

    function cancel () {
      $uibModalInstance.dismiss();
    }

    function add () {
      $http.post('/api/events', vm.event).then(function () {
        $uibModalInstance.close();
      });
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
      });
    }

  }
})();