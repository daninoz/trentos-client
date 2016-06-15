angular.module('trentos')
    .controller('EventsCtrl', function($scope, $auth, $http) {

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.comments = [];
      $scope.displayComments = [];

      $http.get('/api/events').then(function (response) {
        $scope.events = response.data;
      });

      $scope.like = function (id) {
        $http.put('/api/events/' + id + '/likes', {}).then(function (response) {
          getEventById(id).likes = response.data;
        });
      };

      $scope.comment = function (id) {
        $http.post('/api/events/' + id + '/comments', {comment: $scope.comments[id]}).then(function (response) {
          getEventById(id).comments = response.data;
          $scope.comments[id] = '';
        });
      };

      function getEventById(id) {
        return $scope.events.filter(function(event) {
          return event.id === id;
        })[0];
      }

    });
