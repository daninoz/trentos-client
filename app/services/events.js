(function () {
  'use strict';

  angular
      .module('trentos')
      .factory('eventsService', eventsService);

  eventsService.$inject = ['$timeout', '$http', '$rootScope'];
  function eventsService ($timeout, $http, $rootScope) {

    var url,
        sportsUrl,
        todayUrl,
        feedUrl;

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
      displayMap: function (id) {
        this.visibleMaps[id] = !this.visibleMaps[id];
      },
      getEvents: function (vm, restart) {
        if (restart) {
          vm.events = [];
          url = '/api/events';
          vm.loadMoreEnabled = true;
        }
        $http.get(url).then(function (response) {
          url = response.data.next_page_url;
          vm.events = vm.events.concat(response.data.data);
          if (!response.data.next_page_url) {
            vm.loadMoreEnabled = false;
          }
        });
      },
      getEventsBySport: function (vm, sportId, restart) {
        if (restart) {
          vm.events = [];
          sportsUrl = '/api/sports/' + sportId + '/events';
          vm.loadMoreEnabled = true;
        }
        $http.get(sportsUrl).then(function (response) {
          sportsUrl = response.data.next_page_url;
          vm.events = vm.events.concat(response.data.data);
          if (!response.data.next_page_url) {
            vm.loadMoreEnabled = false;
          }
        });
      },
      getTodayEvents: function (vm, restart) {
        if (restart) {
          vm.events = [];
          todayUrl = '/api/events/today';
          vm.loadMoreEnabled = true;
        }
        $http.get(todayUrl).then(function (response) {
          todayUrl = response.data.next_page_url;
          vm.events = vm.events.concat(response.data.data);
          if (!response.data.next_page_url) {
            vm.loadMoreEnabled = false;
          }
        });
      },
      getTodayEventsCount: function () {
        var todayUrl = '/api/events/today';
        return $http.get(todayUrl).then(function (response) {
          return response.data.total;
        });
      },
      getFeedEvents: function (vm, openManageSportsModal, restart) {
        if (restart) {
          vm.events = [];
          feedUrl = '/api/feed';
          vm.loadMoreEnabled = true;
        }
        $http.get(feedUrl).then(function (response) {
          sportsUrl = response.data.next_page_url;
          vm.events = vm.events.concat(response.data.data);
          if (!response.data.next_page_url) {
            vm.loadMoreEnabled = false;
          }
          if (!vm.events.length) {
            openManageSportsModal();
          }
        });
      },
      geocodeLatLng: function (latlng, geocoder, vm) {
        geocoder.geocode({'location': latlng}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              $rootScope.$apply(function () {
                vm.location = results[0].formatted_address;
              });
            }
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

