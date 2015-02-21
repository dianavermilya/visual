'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the visualApp
 */


angular.module('visualApp')
  .controller('HeaderController', function ($scope, $location, $anchorScroll) {
  $scope.scrollTo = function(id) {
    $location.hash(id);
    console.log($location.hash());
    $anchorScroll();
  };
});