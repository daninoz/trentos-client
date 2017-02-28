(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('SportsController', SportsController);

  SportsController.$inject = ['$rootScope', 'eventsService', 'userService', '$auth', '$stateParams', '$uibModal'];
  function SportsController ($rootScope, eventsService, userService, $auth, $stateParams, $uibModal) {

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
    vm.message = "Aun no hay eventos cargados de este deporte";

    eventsService.getEventsBySport(vm, $stateParams.sportId);

    $rootScope.$on('eventsUpdated', function () {
      eventsService.getEventsBySport(vm, $stateParams.sportId);
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
        $rootScope.$broadcast('newEvent');
      });
    }

  }
})();

