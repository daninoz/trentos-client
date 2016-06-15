angular.module('trentos')
    .controller('AddEventCtrl', function ($scope, $uibModalInstance, $http) {

      $scope.event = {};

      $scope.cancel = function () {
        $uibModalInstance.dismiss();
      };

      $http.get('/api/sports').then(function (response) {
        $scope.sports = response.data;
      });

      $scope.add =  function () {
        $http.post('/api/events', $scope.event).then(function () {
          $uibModalInstance.close();
        });
      }

      $scope.format = 'dd/MM/yyyy';
      $scope.datePopup = {
        opened: false
      };
      $scope.dateOptions = {
        formatYear: 'yyyy',
        minDate: new Date(),
        startingDay: 1
      };
      $scope.openDatePopup = function() {
        $scope.datePopup.opened = true;
      };

    });
