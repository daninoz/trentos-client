(function () {
  'use strict';

  angular
      .module('trentos')
      .controller('StatisticsController', StatisticsController);

  StatisticsController.$inject = ['$http', '$q'];
  function StatisticsController ($http, $q) {
    var vm = this;

    initCharts();

    function getStatistics () {
      return $http.get('/api/events/statistics').then(function (response) {
        vm.statistics = response.data;
      });
    }

    function getSports () {
      return $http.get('/api/sports').then(function (response) {
        vm.sports = response.data;
      });
    }

    function initCharts () {
      $q.all([
        $http.get('/api/events/statistics'),
        $http.get('/api/sports')
      ]).then(function(results) {
        vm.statistics = results[0].data;
        vm.sports = results[1].data;

        vm.pieChart = {
          labels: vm.sports.map(function (sport) {
            return sport.name;
          }),
          data: (function () {
            return vm.sports.map(function (sport) {
              var sportStats = getStatisticBySportId(sport.id);
              return parseInt(sportStats.events, 10);
            });
          })()
        };

        vm.barChart = {
          labels: vm.sports.map(function (sport) {
            return sport.name;
          }),
          series: ['Me gusta', 'Comentarios'],
          data: (function () {
            var data = [[],[]];
            vm.sports.forEach(function (sport) {
              var sportStats = getStatisticBySportId(sport.id);
              data[0].push(parseInt(sportStats.likes, 10));
              data[1].push(parseInt(sportStats.comments, 10));
            });

            return data;
          })()
        }
      });
    }

    function getStatisticBySportId (id) {
      return vm.statistics.filter(function (stat) {
        return parseInt(stat.sport_id, 10) === id;
      })[0];
    }

  }
})();