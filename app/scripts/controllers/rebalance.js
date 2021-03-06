'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:RebalanceCtrl
 * @description
 * # RebalanceCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
    .controller('RebalanceCtrl', function ($scope, BinaryTreeService) {

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

		var tree= BinaryTreeService.getBinaryTree();

    });
