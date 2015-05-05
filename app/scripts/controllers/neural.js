'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:NeuralCtrl
 * @description
 * # NeuralCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
    .controller('NeuralCtrl', function ($scope, NeuralNetService) {

		var net = NeuralNetService.getNeuralNet();

    });