(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('EventsController', EventsController);

  EventsController.$inject = ['$rootScope', '$auth', '$http'];
  function EventsController ($rootScope, $auth, $http) {

    var vm = this;

    vm.isAuthenticated = isAuthenticated;
    vm.like = like;
    vm.comment = comment;
    vm.comments = [];
    vm.displayComments = [];

    getEvents();

    $rootScope.$on('newEvent', getEvents);

    function getEvents () {
      $http.get('/api/events').then(function (response) {
        vm.events = response.data;
      });
    }

    function isAuthenticated () {
      return $auth.isAuthenticated();
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

