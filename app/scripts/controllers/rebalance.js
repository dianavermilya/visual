'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:RebalanceCtrl
 * @description
 * # RebalanceCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
    .controller('RebalanceCtrl', function ($scope) {


		function binaryTree(){
			var svgWidth = d3.select(".rebalance-svg-container").node().getBoundingClientRect().width;
			var svgHeight = 460;
			var vRadius=12;
			tree={cx:Math.floor(svgWidth/2), cy:30, w:60, h:60};

			tree.node={id:0, value:0, labeltext:'0', position:{x:tree.cx, y:tree.cy},children:{}};	
			tree.size=1;
			
			tree.getVertices = function(){
				var vertices =[];
				function getVertices(node,parent){
					if (node) {
						var copyOfVertex = {id:node.id, labeltext:node.labeltext, position:node.position, parent:parent} 	
						vertices.push(copyOfVertex);
						var nodeCopy = {id:node.id, position:node.position};
						getVertices(node.children.leftChild, nodeCopy);
						getVertices(node.children.rightChild, nodeCopy);
					}
				}
				getVertices(tree.node,{});
				return vertices.sort(function(a,b){ return a.id - b.id;});
			}
			
			tree.getEdges =  function(){
				var edges =[];
				function getEdges(node){
					function getEdgesOfChild(child){
						if (child) {
							edges.push({parentId:node.id, parentLabel:node.labeltext, parentPosition:node.position, childId:child.id, childLabel:child.labeltext, childPosition:child.position});
							getEdges(child);
						}
					}
					getEdgesOfChild(node.children.leftChild);
					getEdgesOfChild(node.children.rightChild);
				}
				getEdges(tree.node);
				return edges.sort(function(a,b){ return a.childId - b.childId;});	
			}
			
			tree.addLeaf = function(val){
				var newSize = tree.size++
				var newNode = {id:newSize, value:val, labeltext:val.toString(), position:{},children:{}}
				tree.addNode(newNode);
				reposition(tree.node);
				redraw();
			}

			tree.addNode = function(newNode) {
				function chooseBranch(node){
					if (newNode.value != undefined) {
						if (newNode.value <= node.value) {
							addLeftChild(node, newNode);
						} else {
							addRightChild(node, newNode);
						}
					}
				}

				function addLeftChild(node, child) {
					if (!node.children.leftChild) {
						node.children.leftChild = child;
					} else {
						chooseBranch(node.children.leftChild);
					}
				}

				function addRightChild(node, child) {
					if (!node.children.rightChild) {
						node.children.rightChild = child;
					} else {
						chooseBranch(node.children.rightChild);
					}
				}
				chooseBranch(tree.node);

			}
			
			var redraw = function(){
				var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());
				//console.log("without data", d3.select("#g_lines").selectAll('line'));
				//console.log("with data", edges);

				
				edges.transition().duration(500)
					.attr('x1',function(d){ return d.parentPosition.x;}).attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;}).attr('y2',function(d){ return d.childPosition.y;})
			
				edges.enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;}).attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.parentPosition.x;}).attr('y2',function(d){ return d.parentPosition.y;})
					.transition().duration(500)
					.attr('x2',function(d){ return d.childPosition.x;}).attr('y2',function(d){ return d.childPosition.y;});
					
				var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices());

				circles.transition().duration(500).attr('cx',function(d){ return d.position.x;}).attr('cy',function(d){ return d.position.y;});
				
				circles.enter().append('circle').attr('cx',function(d){ return d.parent.position.x;}).attr('cy',function(d){ return d.parent.position.y;}).attr('r',vRadius)
					.on('click',function(d){return tree.addLeaf(d.id);})
					.transition().duration(500).attr('cx',function(d){ return d.position.x;}).attr('cy',function(d){ return d.position.y;});
					
				var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices());
				
				labels.text(function(d){return d.labeltext;}).transition().duration(500)
					.attr('x',function(d){ return d.position.x;}).attr('y',function(d){ return d.position.y+5;});
					
				labels.enter().append('text').attr('x',function(d){ return d.parent.position.x;}).attr('y',function(d){ return d.parent.position.y+5;})
					.text(function(d){return d.labeltext;}).on('click',function(d){return tree.addLeaf(d.id);})
					.transition().duration(500)
					.attr('x',function(d){ return d.position.x;}).attr('y',function(d){ return d.position.y+5;});			
			}
			
			var getLeafCount = function(node) {
				var leafCount = 0

				if (!node.children.leftChild && !node.children.rightChild) {
					leafCount = 1;
				} else {
					if (node.children.leftChild) {
						leafCount +=getLeafCount(node.children.leftChild)
					}
					if (node.children.rightChild) {
						leafCount +=getLeafCount(node.children.rightChild)
					}
				}
				return leafCount;
			};
			
			var reposition = function(node){
				var leafCount = getLeafCount(node);
				var left=node.position.x - tree.w*(leafCount-1)/2;

				function repositionChild(child) {
					if (child) {
						var w =tree.w*getLeafCount(child); 
						left+=w; 
						child.position = {x:left-(w+tree.w)/2, y:node.position.y+tree.h};
						reposition(child);
					}
				}

				repositionChild(node.children.leftChild);
				repositionChild(node.children.rightChild);
			}	
			
			var initialize = function(){										
				d3.select(".rebalance-svg-container").append("svg").attr("width", svgWidth).attr("height", svgHeight).attr('id','treesvg');

				d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;}).attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;}).attr('y2',function(d){ return d.childPosition.y;});

				d3.select("#treesvg").append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices()).enter()
					.append('circle').attr('cx',function(d){ return d.position.x;}).attr('cy',function(d){ return d.position.y;}).attr('r',vRadius)
					.on('click',function(d){return tree.addLeaf(d.id);});
					
				d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
					.attr('x',function(d){ return d.position.x;}).attr('y',function(d){ return d.position.y+5;}).text(function(d){return d.labeltext;})
					.on('click',function(d){return tree.addLeaf(d.id);});	
				tree.addLeaf(7);
				tree.addLeaf(5);
				tree.addLeaf(3);
				tree.addLeaf(6);
				tree.addLeaf(12);
				tree.addLeaf(10);
				tree.addLeaf(4);
				tree.addLeaf(8);
				tree.addLeaf(11);

			}
			initialize();

			return tree;
		}


		$scope.addNode = function() {
			if (tree && $scope.addNodeValue) {
				var addNodeValue = parseInt($scope.addNodeValue);
				tree.addLeaf(addNodeValue);
				$scope.addNodeValue = "";					
			}
    	}

    	function findNode(node, val){
    		if (node.value == val) {
    			return node;
    		} else if (val <= node.value && node.children.leftChild) {
    			return findNode(node.children.leftChild, val);
    		} else if (val > node.value && node.children.rightChild) {
    			return findNode(node.children.rightChild, val);
    		} else {
    			return false;
    		}
    	}

    	$scope.findNode = function() {
    		if (tree && $scope.findNodeValue) {
    			var findNodeValue = parseInt($scope.findNodeValue);
    			var node = findNode(tree.node, findNodeValue);
    			$scope.findNodeValue = "";
    			console.log(node);
    		}
    	}

    	function removeNode(node, val, parent, prop){
    		console.log("node", node, val);
    		if (node.value == val) {
    			parent.children[prop] = undefined;
    			if (node.children.leftChild) {
    				tree.addNode(node.children.leftChild);
    			}
    			if (node.children.rightChild) {
    				tree.addNode(node.children.rightChild);
    			}
    			return node;
    		} else if (val <= node.value && node.children.leftChild) {
    			return removeNode(node.children.leftChild, val, node);
    		} else if (val > node.value && node.children.rightChild) {
    			return removeNode(node.children.rightChild, val, node);
    		} else {
    			return false;
    		}
    	}

    	$scope.removeNode = function() {
    		if (tree && $scope.removeNodeValue) {
    			var removeNodeValue = parseInt($scope.removeNodeValue);
    			removeNode(tree.node, removeNodeValue);
    		}
    	}



		var tree= binaryTree();



    });
