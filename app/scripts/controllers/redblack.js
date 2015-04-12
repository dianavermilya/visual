'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:RedblackCtrl
 * @description
 * # RedblackCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
    .controller('RedblackCtrl', function ($scope, RedBlackTreeService) {

		$scope.addNode = function() {
			if (tree && $scope.addNodeValue) {
				var addNodeValue = parseInt($scope.addNodeValue);
				tree.addNewNodeWithAnimation(addNodeValue);
				$scope.addNodeValue = "";					
			}
    	}

    	$scope.findNode = function() {
    		if (tree && $scope.findNodeValue) {
    			var findNodeValue = parseInt($scope.findNodeValue);
    			var clock = tree.findNode(findNodeValue);
    		}
    		$scope.findNodeValue = "";

    	}

    	$scope.removeNode = function() {
    		if (tree && $scope.removeNodeValue) {
    			var removeNodeValue = parseInt($scope.removeNodeValue);
    			tree.removeNode(removeNodeValue);
    		}
    		$scope.removeNodeValue = "";
    	}

		var tree = RedBlackTreeService.getRedBlackTree();

    });
