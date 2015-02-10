'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
