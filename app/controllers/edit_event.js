(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('EditEventsController', EditEventsController);

  EditEventsController.$inject = ['eventId', 'eventsService', '$uibModalInstance', '$http', 'NgMap'];
  function EditEventsController (eventId, eventsService, $uibModalInstance, $http, NgMap) {
    var vm = this,
        marker,
        geocoder;

    vm.cancel = cancel;
    vm.edit = edit;
    vm.addLocation = addLocation;
    vm.location = '';

    getSports();

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
    }

    function edit () {
      $http.put('/api/events/' + eventId, vm.event).then(function () {
        $uibModalInstance.close();
      });
    }

    function getEvent () {
      $http.get('/api/events/' + eventId).then(function (response) {
        vm.event = response.data;
        vm.event.sport_id = vm.event.sport.id;
        delete vm.event.sport;
        getMap();
      });
    }

    function getSports () {
      $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
        getEvent();
      });
    }

    function getSportById (id) {
      return vm.sports.filter(function (sport) {
        return sport.id === id;
      })[0];
    }

    function getMap () {
      NgMap.getMap('edit-event-map').then(function(map) {
        vm.map = map;
        google.maps.event.trigger(vm.map, 'resize');
        var latLng = getLatLngFromString(vm.event.location);
        marker = new google.maps.Marker({position: latLng, map: vm.map});
        vm.map.panTo(latLng);
        eventsService.geocodeLatLng(latLng, geocoder, vm)
      });
      geocoder = new google.maps.Geocoder;
    }

    function getLatLngFromString(ll) {
      var lat = ll.replace(/\s*\,.*/, ''); // first 123
      var lng = ll.replace(/.*,\s*/, ''); // second ,456

      var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

      return latLng;
    };

  }
})();