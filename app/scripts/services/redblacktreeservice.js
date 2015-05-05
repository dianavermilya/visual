'use strict';

/**
 * @ngdoc service
 * @name visualApp.RedBlackTreeService
 * @description
 * # RedBlackTreeService
 * Service in the visualApp.
 */
angular.module('visualApp')
  .service('RedBlackTreeService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

		function RedBlackTree(){
			var highlightDuration = 1000
			var svgWidth = d3.select(".svg-container").node().getBoundingClientRect().width;
			var svgHeight = 460;
			var vRadius=12;
			var tree={cx:Math.floor(svgWidth/2), cy:30, w:60, h:60};

			tree.root={id:0, value:8, labeltext:'8', position:{x:tree.cx, y:tree.cy}, parent:undefined, color:1};


			tree.size=1;

			tree.findNodeWithAnimation = function(val) {
				function findNodeWithAnimation(node, val, clock){
		    		if (node.value == val) {
		    			highlightCircle(node.id, "#00C782", clock); //green
		    			clock += highlightDuration;
		    		}
		    		else if (val <= node.value && !node.left.isLeaf) {
		    			highlightCircle(node.id, "#00A9C7", clock); //blue
		    			clock = findNodeWithAnimation(node.left, val, clock + highlightDuration);
		    		} else if (val > node.value && !node.right.isLeaf) {
		    			highlightCircle(node.id, "#00A9C7", clock); //blue
		    			clock = findNodeWithAnimation(node.right, val, clock + highlightDuration);
		    		} else {
		    			highlightCircle(node.id, "#F02400", clock); //tomato
		    			clock += highlightDuration;
		    		}
		    		return clock;
		    	}
		    	return findNodeWithAnimation(tree.root, val, 0);
			}
			
			tree.addNewNode = function(val){
				var node = newNode(val);
				var clock = addNode(node);
				rebalanceOnInsert(node);
				reposition();
				redraw();

			}

			tree.addNewNodeWithAnimation = function(val) {
				var node = newNode(val);
				addNode(node);
				var clock = tree.findNodeWithAnimation(node.value)-highlightDuration;

				setTimeout(function(){
					reposition();
					redraw();
					rebalanceOnInsert(node);
					setTimeout(function() {
						reposition();
						redraw();
					}, highlightDuration);
				}, clock);
			}

			var newNode = function(val) {
				var newSize = tree.size++;
				var node = {
					id:newSize, 
					value:val, 
					labeltext:val.toString(), 
					position:{},
					left: newLeaf(),
					right: newLeaf(),
					parent: undefined, 
					color:1
				};
				node.left.parent = node;
				node.right.parent = node;
				return node;
			}

			var newLeaf = function() {
				var newSize = tree.size++
				return {
					id:newSize,
					position:{},
					parent: undefined,
					color:0,
					isLeaf: true
				}
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
					return (!node.right.isLeaf) ? node.right : node;
				}

				function removeNodeAndReorganize(node) {
					if (node.left.isLeaf || node.right.isLeaf) { // 0 or 1 children
						var child = (node.right.isLeaf) ? node.left : node.right;
						if (node == tree.root) {
							tree.root = undefined;
						} else if (node == node.parent.left) {
							node.parent.left = child;
							if (child){
								child.parent = node.parent;
							}
						} else {
							node.parent.right = child;
							if (child){
								child.parent = node.parent;
							}						
						}

						//rebalance
						if (node.color == 0) {
							if (child.color == 1) {
								child.color = 0;
							} else {
								rebalanceOnDelete(child);
							}
						}
						return 0;

					} else { // 2 children
						var swapNode = maxOfSubTree(node.left);
						var nodeVal = node.value;
						var nodeText = node.labeltext;
						var nodeId = node.id;
						node.value = swapNode.value;
						node.labeltext = swapNode.labeltext;
						node.id = swapNode.id
						swapNode.value = nodeVal;
						swapNode.labeltext = nodeText;
						swapNode.id = nodeId;
						redraw();
						removeNodeAndReorganize(swapNode);
						return highlightDuration;
					}
				}

				var node = findNode(val);
				var clock = tree.findNodeWithAnimation(val);

				setTimeout(function(){
					if (node) {
						var clock2 = removeNodeAndReorganize(node);
						reposition();
						setTimeout(function() {
							redraw();					
						}, clock2);
					}
				}, clock);
	    	}

	    	var addNode = function(newNode) {
				function chooseBranch(node){
					if (newNode.value != undefined) {
						if (newNode.value <= node.value) {
							addleft(node, newNode);
						} else {
							addright(node, newNode);
						}
					}
				}
				function addleft(node, child) {
					if (node.left.isLeaf) {
						node.left = child;
						child.parent = node;
					} else {
						chooseBranch(node.left);
					}
				}
				function addright(node, child) {
					if (node.right.isLeaf) {
						node.right = child;
						child.parent = node;
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

			//	rebalancing functions 	
			var rebalanceOnDelete = function(node) {
				if (!tree.root) {
					return;
				}
	    		delete_case1(node);

	    		function sibling(node) {
					if (node == node.parent.left) {
						return node.parent.right; 
					} else {
						return node.parent.left;
					}
				}

				function delete_case1(node) {
					if (node != tree.root) {
						delete_case2(node);
					}
				}

				function delete_case2(node) {
					var S = sibling(node);
					if (S.color == 1) {
						node.parent.color = 1;
						S.color = 0;
						if (node == node.parent.left) {
							rotate_left(node.parent)
						} else {
							rotate_right(node.parent)
						}
					}
					delete_case3(node);
				}

				function delete_case3(node){

					var S = sibling(node);
					if ((node.parent.color == 0) &&
						(S.color == 0) &&
						(S.left.color == 0) &&
						(S.right.color == 0)) {
						S.color = 1;
						delete_case1(node.parent);
					} else {
						delete_case4(node);
					}
				}

				function delete_case4(node) {
					var S = sibling(node);
					if ((node.parent.color == 1) &&
						(S.color == 0) &&
						(S.left.color == 0) &&
						(S.right.color == 0)) {
						S.color = 1;
						node.parent.color = 0;
					} else {
						delete_case5(node);
					}
				}

				function delete_case5(node) {
					var S = sibling(node);
					if (S.color == 0) {
						if ((node == node.parent.left) &&
							(S.right.color == 0) &&
							(S.left.color == 1)) {
							S.color = 1;
							S.left.color = 0;
							rotate_right(S);
						} else if ((node == node.parent.right) &&
             				(S.left.color == 0) &&
             				(S.right.color == 1)) {
							S.color = 1
							S.right.color = 0;
							rotate_left(S);
						}
					}
					delete_case6(node);
				}

				function delete_case6(node) {
					var S = sibling(node);
					S.color = node.parent.color;
					node.parent.color = 0;
					if (node == node.parent.left) {
						S.right.color = 0;
						rotate_left(node.parent);
					} else {
						S.left.color = 0;
						rotate_right(node.parent);
					}
				}
	    	}

	    	var rebalanceOnInsert = function(node) {
	    		insert_case1(node)

				function insert_case1(node) {
					if (node == tree.root) {
						node.color = 0;
					} else {
						insert_case2(node);
					}
				}
				function insert_case2(node) {
					if (node.parent.color == 0 ) {
						return;
					} else {
						insert_case3(node);
					}
				}
				function insert_case3(node) {
					var aunt = getAunt(node);
					if (aunt && aunt.color == 1) {
						node.parent.color = 0;
						aunt.color = 0;
						var g = getGrandParent(node);
						g.color = 1;
						insert_case1(g);
					} else {
						insert_case4(node);
					}
				}
				function insert_case4(node) {
					var g = getGrandParent(node);


					if ((node == node.parent.right)
						&& (node.parent == g.left)) {
						rotate_left(node.parent);
					  	node = node.left;
					} else if ((node == node.parent.left)
						&& (node.parent == g.right)) {
  						rotate_right(node.parent);
 						node = node.right; 
					}
					insert_case5(node);
				}
				function insert_case5(node) { 
					var g = getGrandParent(node)
					node.parent.color = 0;
					g.color = 1;
					if (node == node.parent.left) {
						rotate_right(g)
					} else {
						rotate_left(g)
					}
				}
			}

			var rotate_right = function(Q) {
				var r = Q.parent
				var P = Q.left
				Q.left = P.right
				Q.left.parent = Q
				P.right = Q
				P.right.parent = P
				P.parent = r
				if (!r) {
					tree.root = P
				} else {
					if (r.left == Q) {
						r.left = P
					} else {
						r.right = P
					}						
				}
			}

	    	var rotate_left = function (P) {
				var r = P.parent
				var Q = P.right
				P.right = Q.left
				P.right.parent = P
				Q.left = P
				Q.left.parent = Q
				Q.parent = r
				if (!r) {
					tree.root = Q
				} else {
					if (r.right == P) {
						r.right = Q
					} else {
						r.left = Q
					}
				}
			}
	
			// If the grandparent does not exist, this function returns undefined 
			var getGrandParent = function(node) {
				if (node.parent && node.parent.parent) {
					return node.parent.parent
				}
			};

			// If the aunt does not exist, this function returns undefined 
			var getAunt = function(node) {
				var grandParent = getGrandParent(node)
				if (grandParent) {
					if (node.parent == grandParent.left) {
						return grandParent.right
					} else {
						return grandParent.left
					} 		
				}
			};

			var getLeafCount = function(node) {
				if (!node) {
					return 0;
				}
				var leafCount = 0

				if (node.isLeaf) {
					leafCount = 1;
				} else {
					leafCount +=getLeafCount(node.left)
					leafCount +=getLeafCount(node.right)
				}
				return leafCount;
			};

			var getVertices = function(){
				var vertices =[];
				function getVerticesFromChild(node,parent){
					var copyOfVertex = {id:node.id, labeltext:node.labeltext, position:node.position, parent:parent, color: node.color} 	
					vertices.push(copyOfVertex);
					var nodeCopy = {id:node.id, position:node.position};
					if (!node.isLeaf) {
						getVerticesFromChild(node.left, nodeCopy);
						getVerticesFromChild(node.right, nodeCopy);
					}
				}
				if (tree.root) getVerticesFromChild(tree.root,{position:{x:tree.cx, y:tree.cy}});
				var sortedVertices = vertices.sort(function(a,b){ return a.id - b.id;});
				return sortedVertices;
			};
			
			var getEdges = function(){
				var edges =[];
				function getEdgesOfNode(node){
					if (!node.isLeaf) {
						getEdgesOfChild(node.left, node);
						getEdgesOfChild(node.right, node);
					}
				}
				function getEdgesOfChild(child, parent){
					edges.push({parentId:parent.id, parentLabel:parent.labeltext, parentPosition:parent.position, childId:child.id, childLabel:child.labeltext, childPosition:child.position});
					getEdgesOfNode(child);
				}
				if (tree.root) getEdgesOfNode(tree.root);
				return edges.sort(function(a,b){ return a.childId - b.childId;});	
			};
			
			
			/*Positioning and Drawing Functions*/
			
			var reposition = function(){
				if (!tree.root) {
					return;
				}
				function repositionChild(node, parent, parentLeft) {
					var w =tree.w*getLeafCount(node); 
					parentLeft+=w; 
					node.position = {x:parentLeft-(w+tree.w)/2, y:parent.position.y+tree.h};

					var leafCount = getLeafCount(node);
					var left=node.position.x - tree.w*(leafCount-1)/2;
					if (!node.isLeaf) {
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
				repositionChild(root.right, root, left);
			}	

			var redraw = function(){
				var edges = d3.select("#g_lines").selectAll('line').data(getEdges(), function(d){return d.childId});
				
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

				circles = d3.select("#g_circles").selectAll('circle').data(getVertices(), function(d){return d.id});
				circles.style("fill", function(d) {return (d.color == 0) ? "#A9A9A9" : "#FF745c"})

				var labels = d3.select("#g_labels").selectAll('text').data(getVertices(), function(d){ return d.id});
				
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

				//var circle = d3.select('#g_circles').selectAll('circle');
				//circle.transition().style("fill", "#A9A9A9");
			}

			var highlightCircle = function(id, color, start) {
				var circle = d3.select('#g_circles').select("#name"+id)
	    		var end = start+highlightDuration
	    		circle
  					.transition().delay(start)
  					.style("stroke", color)
  					.style("stroke-width", "4px")
  					.transition().duration(highlightDuration-500).delay(end-500)
  					.style("stroke","grey")
  					.style("stroke-width", "2px");

  				return end
	    	};

			var initialize = function(){
				tree.root.left = newLeaf()	
				tree.root.right = newLeaf()
				rebalanceOnInsert(tree.root)
				reposition()

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
					.text(function(d){return d.labeltext;})


				tree.addNewNode(7);
				tree.addNewNode(5);
				tree.addNewNode(3);
				tree.addNewNode(6);
				tree.addNewNode(12);
				tree.addNewNode(10);
				tree.addNewNode(4);
				tree.addNewNode(11);
				reposition()



			}
			initialize();

			return tree;
		}
		this.getRedBlackTree = function() {
			return RedBlackTree()
		}

  });
