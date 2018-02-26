(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('TodayController', TodayController);

  TodayController.$inject = ['$rootScope', 'eventsService', 'userService', '$auth', '$stateParams', '$uibModal'];
  function TodayController ($rootScope, eventsService, userService, $auth, $stateParams, $uibModal) {

    var vm = this;

    vm.isAuthenticated = $auth.isAuthenticated;
    vm.isAuthor = userService.isAuthor;
    vm.isAdmin = userService.isAdmin;
    vm.like = eventsService.like;
    vm.comment = eventsService.comment;
    vm.remove = eventsService.remove;
    vm.edit = edit;
    vm.highlight = eventsService.highlight;
    vm.displayMap = eventsService.displayMap;
    vm.loadMore = loadMore;
    vm.visibleMaps = {};
    vm.comments = [];
    vm.displayComments = [];
    vm.message = "No hay eventos para hoy";

    eventsService.getTodayEvents(vm, true);

    $rootScope.$on('eventsUpdated', function () {
      eventsService.getTodayEvents(vm, true);
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

    function loadMore() {
      eventsService.getTodayEvents(vm);
    }

  }
})();

