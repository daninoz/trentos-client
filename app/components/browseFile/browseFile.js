(function () {
  'use strict';

  angular
      .module('trentos')
      .directive('browseFile', browseFile);

  function browseFile () {
    var directive = {
      restrict: 'A',
      replace: true,
      transclude: true,
      templateUrl: 'app/components/browseFile/browseFile.html',
      scope: {
        BrowseFile: '='
      },
      link: link
    };

    return directive;

    function link (scope, element, attrs) {
      var inputElement = angular.element('<input type="file">');

      for (var attribute in scope.BrowseFile) {
        if (scope.BrowseFile.hasOwnProperty(attribute)) {
          inputElement.attr(attribute, scope.BrowseFile[attribute]);
        }
      }

      attrs.$observe('disabled', function(value) {
        inputElement.attr('disabled', value);
      });

      element.append(inputElement);

      inputElement.on('change', function () {
        scope.$emit('BrowseFile:Selection', inputElement[0].files);
      });

      scope.$on('BrowseFile:Clear', function () {
        inputElement.val('');
      });
    }
  }
})();