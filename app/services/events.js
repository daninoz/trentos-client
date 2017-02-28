(function () {
  'use strict';

  angular
      .module('trentos')
      .factory('eventsService', eventsService);

  eventsService.$inject = ['$http', '$rootScope'];
  function eventsService ($http, $rootScope) {

    function getEventById (id, vm) {
      return vm.events.filter(function (event) {
        return event.id === id;
      })[0];
    }

    return {
      comment: function (id, vm) {
        $http.post('/api/events/' + id + '/comments', {comment: vm.comments[id]}).then(function (response) {
          getEventById(id, vm).comments = response.data;
          vm.comments[id] = '';
        });
      },
      getEvents: function (vm) {
        $http.get('/api/events').then(function (response) {
          vm.events = response.data;
        });
      },
      getEventsBySport: function (vm, sportId) {
        $http.get('/api/sports/' + sportId + '/events').then(function (response) {
          vm.events = response.data;
        });
      },
      getFeedEvents: function (vm, openManageSportsModal) {
        $http.get('/api/feed').then(function (response) {
          vm.events = response.data;
          if (!vm.events.length) {
            openManageSportsModal();
          }
        });
      },
      highlight: function (eventId) {
        $http.patch('/api/events/' + eventId).then(function (response) {
          $rootScope.$broadcast('eventsUpdated');
        });
      },
      like: function (id, vm) {
        $http.put('/api/events/' + id + '/likes', {}).then(function (response) {
          getEventById(id, vm).likes = response.data;
        });
      },
      remove: function (eventId) {
        $http.delete('/api/events/' + eventId).then(function (response) {
          $rootScope.$broadcast('eventsUpdated');
        });
      }
    };
  }
})();

