'use strict';

/**
 * @ngdoc service
 * @name visualApp.BinaryTreeService
 * @description
 * # BinaryTreeService
 * Service in the visualApp.
 */
angular.module('visualApp')
  .service('BinaryTreeService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

		function BinaryTree(){
			var highlightDuration = 1000
			var svgWidth = d3.select(".svg-container").node().getBoundingClientRect().width;
			var svgHeight = 460;
			var vRadius=12;
			var tree={cx:Math.floor(svgWidth/2), cy:30, w:60, h:60};

			tree.root={id:0, value:0, position:{x:tree.cx, y:tree.cy}, parent:undefined};	
			tree.size=1;

			tree.findNodeWithAnimation = function(val) {
				function findNodeWithAnimation(node, val, clock){
		    		if (node.value == val) {
		    			highlightCircle(node.id, "#79D667", clock)
		    			clock += highlightDuration
		    		}
		    		else if (val <= node.value && node.left) {
		    			highlightCircle(node.id, "#BCE0FF", clock)
		    			clock = findNodeWithAnimation(node.left, val, clock + highlightDuration);
		    		} else if (val > node.value && node.right) {
		    			highlightCircle(node.id, "#BCE0FF", clock)
		    			clock = findNodeWithAnimation(node.right, val, clock + highlightDuration);
		    		} else {
		    			highlightCircle(node.id, "#D76C79", clock)
		    			clock += highlightDuration
		    		}
		    		return clock
		    	}
		    	return findNodeWithAnimation(tree.root, val, 0);
			}
			
			tree.addNewNode = function(val){
				var node = newNode(val)
				addNode(node);
				reposition();
				redraw()

			}
			tree.addNewNodeWithAnimation = function(val) {
				var node = newNode(val)
				addNode(node);
				reposition();
				var clock = tree.findNodeWithAnimation(val);
				setTimeout(function(){redraw()}, clock-highlightDuration);
			}

			var newNode = function(val) {
				var newSize = tree.size++
				return {
					id:newSize, 
					value:val, 
					position:{},
					parent: undefined, 
					color:1
				};
			}

			var findNode = function(val) {
				function findNode(node, val){
		    		if (node.value == val) {
		    			return node;
		    		}
		    		else if (val <= node.value && node.left) {
		    			return findNode(node.left, val);
		    		} else if (val > node.value && node.right) {
		    			return findNode(node.right, val);
		    		}
		    		return;
		    	}
		    	return findNode(tree.root, val);
			}

			tree.removeNode = function(val){

				function maxOfSubTree(node) {
					return (node.right) ? node.right : node 
				}

				function removeNodeAndReorganize(node) {
					if (!(node.left && node.right)) { // 0 or 1 children
						var child = (node.left) ? node.left : node.right;
						if (node == tree.root) {
							tree.root = child
						} else if (node == node.parent.left) {
							node.parent.left = child
							if (child) {
								child.parent = node.parent
							}
						} else {
							node.parent.right = child
							if (child) {
								child.parent = node.parent
							}
						}
					} else { // 2 children
						var swapNode = maxOfSubTree(node.left)
						node.value = swapNode.value
						removeNodeAndReorganize(swapNode);
					}
				}
				var clock = tree.findNodeWithAnimation(val);
				var node = findNode(val);
				setTimeout(function(){
					if (node) {
						removeNodeAndReorganize(node)
						reposition()
						redraw()
					}
				}, clock);
	    	}

	    	var addNode = function(newNode) {
				function chooseBranch(node){
					if (newNode.value != undefined) {
						if (newNode.value <= node.value) {
							addLeft(node, newNode);
						} else {
							addRight(node, newNode);
						}
					}
				}
				function addLeft(node, child) {
					if (!node.left) {
						node.left = child;
						child.parent = node
					} else {
						chooseBranch(node.left);
					}
				}
				function addRight(node, child) {
					if (!node.right) {
						node.right = child;
						child.parent = node
					} else {
						chooseBranch(node.right);
					}
				}
				if (!tree.root) {
					newNode.position = {x:tree.cx, y:tree.cy};
					tree.root = newNode;
				} else {
					chooseBranch(tree.root);
				}
			}
			
			var getLeafCount = function(node) {
				var leafCount = 0

				if (!node.left && !node.right) {
					leafCount = 1;
				} else {
					if (node.left) {
						leafCount +=getLeafCount(node.left)
					}
					if (node.right) {
						leafCount +=getLeafCount(node.right)
					}
				}
				return leafCount;
			};

			var getVertices = function(){
				var vertices =[];
				function getVerticesFromChild(node,parent){
					if (node) {
						var copyOfVertex = {id:node.id, value:node.value, position:node.position, parent:parent} 	
						vertices.push(copyOfVertex);
						var nodeCopy = {id:node.id, position:node.position};
						getVerticesFromChild(node.left, nodeCopy);
						getVerticesFromChild(node.right, nodeCopy);
					}
				}
				if (tree.root) getVerticesFromChild(tree.root,{position:{x:tree.cx, y:tree.cy}});
				var sortedVertices = vertices.sort(function(a,b){ return a.id - b.id;});
				return sortedVertices;
			}
			
			var getEdges = function(){
				var edges =[];
				function getEdgesOfNode(node){
					function getEdgesOfChild(child){
						if (child) {
							edges.push({parentId:node.id, parentPosition:node.position, childId:child.id, childPosition:child.position});
							getEdgesOfNode(child);
						}
					}
					getEdgesOfChild(node.left);
					getEdgesOfChild(node.right);
				}
				if (tree.root) getEdgesOfNode(tree.root);
				return edges.sort(function(a,b){ return a.childId - b.childId;});	
			}
			

			
			/*Positioning and Drawing Functions*/
			
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
						left = repositionChild(node.left, node, left);
						left = repositionChild(node.right, node, left);
					}
					return parentLeft
				}

				var root = tree.root;
				root.position = {x:tree.cx, y:tree.cy};
				var leafCount = getLeafCount(root);
				var left=root.position.x - tree.w*(leafCount-1)/2;

				left = repositionChild(root.left, root, left);
				left = repositionChild(root.right, root, left);
			}	

			var redraw = function(){
				var edges = d3.select("#g_lines").selectAll('line').data(getEdges(), function(d){return d.childId});
				console.log(edges);
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

				var circles = d3.select("#g_circles").selectAll('circle').data(getVertices(), function(d){return d.id});

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
				circles.exit().remove();

				var labels = d3.select("#g_labels").selectAll('text').data(getVertices(), function(d){ return d.id});
				
				labels.text(function(d){return d.value.toString();})
					.transition().duration(500)
						.attr('x',function(d){ return d.position.x;})
						.attr('y',function(d){ return d.position.y+5;});
					
				labels.enter().append('text')
					.attr('x',function(d){ return d.parent.position.x;})
					.attr('y',function(d){ return d.parent.position.y+5;})
					.text(function(d){return d.value.toString();})
					.transition().duration(500)
						.attr('x',function(d){ return d.position.x;})
						.attr('y',function(d){ return d.position.y+5;});
			
				labels.exit().remove();	
			}

			var highlightCircle = function(id, color, start) {
	    		var circle = d3.select('#g_circles').select("#name"+id)
	    		var end = start+highlightDuration
	    		circle
  					.transition().delay(start)
  					.style("fill", color)
  					.transition().duration(highlightDuration-500).delay(end-500)
  					.style("fill","white");
  				return end
	    	};

			var initialize = function(){										
				d3.select(".svg-container").append("svg")
					.attr("width", svgWidth)
					.attr("height", svgHeight)
					.attr('id','treesvg');

				var edges = d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line').data(getEdges(), function(d){return d.childId});

				edges.enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;})
					.attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;})
					.attr('y2',function(d){ return d.childPosition.y;});

				var circles = d3.select("#treesvg").append('g').attr('id','g_circles').selectAll('circle').data(getVertices(), function(d){return d.id});
				circles.enter().append('circle')
					.attr('id', function(d){return 'name' + d.id})
					.attr('cx',function(d){ return d.position.x;})
					.attr('cy',function(d){ return d.position.y;})
					.attr('r',vRadius)
					
				var labels = d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(getVertices(), function(d){return d.id})
				labels.enter().append('text')
					.attr('x',function(d){ return d.position.x;})
					.attr('y',function(d){ return d.position.y+5;})
					.text(function(d){return d.value.toString();})
				tree.addNewNode(7);
				//tree.addNewNode(5);
				//tree.addNewNode(3);
				//tree.addNewNode(6);
				//tree.addNewNode(12);
			//	tree.addNewNode(10);
			///	tree.addNewNode(4);
			//	tree.addNewNode(8);
			//	tree.addNewNode(11);
			}
			initialize();

			return tree;
		}
		this.getBinaryTree = function() {
			return BinaryTree()
		}

  });
