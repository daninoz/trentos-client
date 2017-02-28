(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('FeedController', FeedController);

  FeedController.$inject = ['$rootScope', 'eventsService', 'userService', '$auth', '$uibModal', '$state'];
  function FeedController ($rootScope, eventsService, userService, $auth, $uibModal, $state) {

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
    vm.message = "Aun no elegiste tus deportes";

    eventsService.getFeedEvents(vm, openManageSportsModal, true);

    $rootScope.$on('eventsUpdated', function () {
      eventsService.getFeedEvents(vm, openManageSportsModal, true);
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

    function openManageSportsModal () {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/partials/manage_sports.html',
        controller: 'ManageSportsController',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        $state.go('feed', undefined, {reload: true});
      });
    }

    function loadMore() {
      eventsService.getFeedEvents(vm, openManageSportsModal);
    }

  }
})();

