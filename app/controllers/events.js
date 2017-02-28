(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('EventsController', EventsController);

  EventsController.$inject = ['$rootScope', 'userService', 'eventsService', '$auth', '$uibModal'];
  function EventsController ($rootScope, userService, eventsService, $auth, $uibModal) {

    var vm = this;

    vm.isAuthenticated = $auth.isAuthenticated;
    vm.isAuthor = userService.isAuthor;
    vm.isAdmin = userService.isAdmin;
    vm.like = eventsService.like;
    vm.comment = eventsService.comment;
    vm.remove = eventsService.remove;
    vm.edit = edit;
    vm.highlight = eventsService.highlight;
    vm.comments = [];
    vm.displayComments = [];
    vm.message = "Aun no hay eventos cargados";

    eventsService.getEvents(vm);

    $rootScope.$on('eventsUpdated', function () {
      eventsService.getEvents(vm);
    });

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
        $rootScope.$broadcast('eventsUpdated');
      });
    }

  }
})();

