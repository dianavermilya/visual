'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
