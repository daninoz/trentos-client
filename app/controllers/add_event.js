(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('AddEventsController', AddEventsController);

  AddEventsController.$inject = ['eventsService', '$uibModalInstance', '$http', 'NgMap'];
  function AddEventsController (eventsService, $uibModalInstance, $http, NgMap) {
    var vm = this;
    var marker,
        geocoder;

    vm.event = {};
    vm.location = '';
    vm.add = add;
    vm.addLocation = addLocation;
    vm.cancel = cancel;

    getSports();
    getMap();

    function add () {
      $http.post('/api/events', vm.event).then(function () {
        $uibModalInstance.close();
        if (marker) {
          marker.setMap(null);
        }
      });
    }

    function addLocation (e) {
      if (marker) {
        marker.setPosition(e.latLng);
      } else {
        marker = new google.maps.Marker({position: e.latLng, map: vm.map});
      }
      vm.event.location = e.latLng.lat() + ',' + e.latLng.lng();
      vm.map.panTo(e.latLng);
      eventsService.geocodeLatLng(e.latLng, geocoder, vm)
    }

    function cancel () {
      $uibModalInstance.dismiss();
      if (marker) {
        marker.setMap(null);
      }
    }

    function getMap () {
      NgMap.getMap('add-event-map').then(function(map) {
        vm.map = map;
        google.maps.event.trigger(vm.map, 'resize');
      });
      geocoder = new google.maps.Geocoder;
    };

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
      });
    }

  }
})();