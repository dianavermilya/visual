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
			var highlightDuration = 1000
			var svgWidth = d3.select(".rebalance-svg-container").node().getBoundingClientRect().width;
			var svgHeight = 460;
			var vRadius=12;
			tree={cx:Math.floor(svgWidth/2), cy:30, w:60, h:60};

			tree.root={id:0, value:0, labeltext:'0', position:{x:tree.cx, y:tree.cy},children:{}};	
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
				if (tree.root) getVertices(tree.root,{position:{x:tree.cx, y:tree.cy}});
				var sortedVertices = vertices.sort(function(a,b){ return a.id - b.id;});
				return sortedVertices;
			}
			
			tree.getEdges = function(){
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
				if (tree.root) getEdges(tree.root);
				return edges.sort(function(a,b){ return a.childId - b.childId;});	
			}

			tree.findNode = function(val) {
				function findNode(node, val, clock){
		    		if (node.value == val) {
		    			tree.highlightCircle(node.id, "#79D667", clock)
		    			clock += highlightDuration
		    		}
		    		else if (val <= node.value && node.children.leftChild) {
		    			tree.highlightCircle(node.id, "#BCE0FF", clock)
		    			clock = findNode(node.children.leftChild, val, clock + highlightDuration);
		    		} else if (val > node.value && node.children.rightChild) {
		    			tree.highlightCircle(node.id, "#BCE0FF", clock)
		    			clock = findNode(node.children.rightChild, val, clock + highlightDuration);
		    		} else {
		    			tree.highlightCircle(node.id, "#D76C79", clock)
		    			clock += highlightDuration
		    		}
		    		return clock
		    	}
		    	return findNode(tree.root, val, 0);
			}

			tree.highlightCircle = function(id, color, start) {
	    		var circle = d3.select('#g_circles').select("#name"+id)
	    		var end = start+highlightDuration
	    		circle
  					.transition().delay(start)
  					.style("fill", color)
  					.transition().duration(highlightDuration-500).delay(end-500)
  					.style("fill","white");
  				return end
	    	};
			
			tree.addLeaf = function(val){
				var newSize = tree.size++
				var newNode = {id:newSize, value:val, labeltext:val.toString(), position:{},children:{}}
				tree.addNode(newNode);
				reposition();
				redraw()

			}
			tree.addLeafWithAnimation = function(val) {
				var newSize = tree.size++
				var newNode = {id:newSize, value:val, labeltext:val.toString(), position:{},children:{}}
				tree.addNode(newNode);
				reposition();
				var clock = tree.findNode(val);
				setTimeout(function(){redraw()}, clock-highlightDuration);
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
				if (!tree.root) {
					newNode.position = {x:tree.cx, y:tree.cy};
					tree.root = newNode;
				} else {
					chooseBranch(tree.root);
				}
			}

			tree.removeNode = function(val){
				if (!tree.root) {
					return;
				}

				function removeNodeFromChild (node, val, parent, prop) {
					if (node.value == val) {
						if (parent) {
			    			delete parent.children[prop];
						} else {
							tree.root = null;
						}
		    			if (node.children.leftChild) {
		    				tree.addNode(node.children.leftChild);
		    			}
		    			if (node.children.rightChild) {
		    				tree.addNode(node.children.rightChild);
		    			}
		    			return node;
		    		} else if (val <= node.value && node.children.leftChild) {
		    			return removeNodeFromChild(node.children.leftChild, val, node, "leftChild");
		    		} else if (val > node.value && node.children.rightChild) {
		    			return removeNodeFromChild(node.children.rightChild, val, node, "rightChild");
		    		} else {
		    			return false;
		    		}			
				}

	    		var clock = tree.findNode(val);
				removeNodeFromChild(tree.root, val);
	    		reposition();
				setTimeout(function(){redraw()}, clock);
	    	}

			var redraw = function(){
				var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges(), function(d){return d.childId});
				
				edges.transition().duration(500)
					.attr('x1',function(d){ return d.parentPosition.x;})
					.attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;})
					.attr('y2',function(d){ return d.childPosition.y;})

			
				edges.enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;})
					.attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.parentPosition.x;})
					.attr('y2',function(d){ return d.parentPosition.y;})
					.transition().duration(500)
						.attr('x2',function(d){ return d.childPosition.x;})
						.attr('y2',function(d){ return d.childPosition.y;});
				
				edges.exit().remove();

				var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices(), function(d){return d.id});

				circles.transition().duration(500)
				.attr('cx',function(d){ return d.position.x;})
				.attr('cy',function(d){ return d.position.y;});
				
				circles.enter().append('circle')
					.attr('id', function(d){return 'name' + d.id})

					.attr('cx',function(d){ return d.parent.position.x;})
					.attr('cy',function(d){ return d.parent.position.y;})
					.attr('r',vRadius)
					.transition().duration(500)
						.attr('cx',function(d){ return d.position.x;})
						.attr('cy',function(d){ return d.position.y;});
				circles.classed('selected');
				circles.exit().remove();

				var labels = d3.select("#g_labels").selectAll('text').data(tree.getVertices(), function(d){ return d.id});
				
				labels.text(function(d){return d.labeltext;})
					.transition().duration(500)
						.attr('x',function(d){ return d.position.x;})
						.attr('y',function(d){ return d.position.y+5;});
					
				labels.enter().append('text')
					.attr('x',function(d){ return d.parent.position.x;})
					.attr('y',function(d){ return d.parent.position.y+5;})
					.text(function(d){return d.labeltext;})
					.transition().duration(500)
						.attr('x',function(d){ return d.position.x;})
						.attr('y',function(d){ return d.position.y+5;});
			
				labels.exit().remove();	
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
			
			var reposition = function(){
				if (!tree.root) {
					return;
				}
				function repositionChild(node, parent, parentLeft) {
					if (node) {
						var w =tree.w*getLeafCount(node); 
						parentLeft+=w; 
						node.position = {x:parentLeft-(w+tree.w)/2, y:parent.position.y+tree.h};

						var leafCount = getLeafCount(node);
						var left=node.position.x - tree.w*(leafCount-1)/2;
						left = repositionChild(node.children.leftChild, node, left);
						left = repositionChild(node.children.rightChild, node, left);
					}
					return parentLeft
				}

				var root = tree.root;
				root.position = {x:tree.cx, y:tree.cy};
				var leafCount = getLeafCount(root);
				var left=root.position.x - tree.w*(leafCount-1)/2;

				left = repositionChild(root.children.leftChild, root, left);
				left = repositionChild(root.children.rightChild, root, left);
			}	
			
			var initialize = function(){										
				d3.select(".rebalance-svg-container").append("svg")
					.attr("width", svgWidth)
					.attr("height", svgHeight)
					.attr('id','treesvg');

				var edges = d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges(), function(d){return d.childId});

				edges.enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;})
					.attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;})
					.attr('y2',function(d){ return d.childPosition.y;});

				var circles = d3.select("#treesvg").append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices(), function(d){return d.id});
				circles.enter().append('circle')
					.attr('id', function(d){return 'name' + d.id})
					.attr('cx',function(d){ return d.position.x;})
					.attr('cy',function(d){ return d.position.y;})
					.attr('r',vRadius)
					
				var labels = d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices(), function(d){return d.id})
				labels.enter().append('text')
					.attr('x',function(d){ return d.position.x;})
					.attr('y',function(d){ return d.position.y+5;})
					.text(function(d){return d.labeltext;})
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
				tree.addLeafWithAnimation(addNodeValue);
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
		var tree= binaryTree();

    });
