'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the visualApp
 */


angular.module('visualApp')
  .controller('HeaderController', function ($scope, $location) {
     $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };
  });


