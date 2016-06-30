(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('SportsController', SportsController);

  SportsController.$inject = ['$rootScope', '$auth', '$http', '$stateParams', '$uibModal'];
  function SportsController ($rootScope, $auth, $http, $stateParams, $uibModal) {

    var vm = this;

    vm.isAuthenticated = isAuthenticated;
    vm.isAuthor = isAuthor;
    vm.isAdmin = isAdmin;
    vm.like = like;
    vm.comment = comment;
    vm.remove = remove;
    vm.edit = edit;
    vm.highlight = highlight;
    vm.comments = [];
    vm.displayComments = [];

    getEvents();

    $rootScope.$on('newEvent', getEvents);

    function getEvents () {
      $http.get('/api/sports/' + $stateParams.sportId + '/events').then(function (response) {
        vm.events = response.data;
      });
    }

    function remove (eventId) {
      $http.delete('/api/events/' + eventId).then(function (response) {
        getEvents();
      });
    }

    function highlight (eventId) {
      $http.patch('/api/events/' + eventId).then(function (response) {
        getEvents();
      });
    }

    function edit (eventId) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/edit_event.html',
        controller: 'EditEventsController',
        controllerAs: 'vm',
        resolve: {
          eventId: function () {
            return eventId;
          }
        }
      });

      modalInstance.result.then(function () {
        $rootScope.$broadcast('newEvent');
      });
    }

    function isAuthenticated () {
      return $auth.isAuthenticated();
    }

    function isAuthor(userId) {
      if ($rootScope.user.id) {
        return $rootScope.user.id === userId;
      }
    }

    function isAdmin() {
      if ($rootScope.user.id) {
        return $rootScope.user.is_admin;
      }
    }

    function like (id) {
      $http.put('/api/events/' + id + '/likes', {}).then(function (response) {
        getEventById(id).likes = response.data;
      });
    }

    function comment (id) {
      $http.post('/api/events/' + id + '/comments', {comment: vm.comments[id]}).then(function (response) {
        getEventById(id).comments = response.data;
        vm.comments[id] = '';
      });
    };

    function getEventById (id) {
      return vm.events.filter(function (event) {
        return event.id === id;
      })[0];
    }

  }
})();

