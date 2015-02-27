'use strict';

/**
 * @ngdoc function
 * @name visualApp.controller:RebalanceCtrl
 * @description
 * # RebalanceCtrl
 * Controller of the visualApp
 */
angular.module('visualApp')
    .controller('RebalanceCtrl', function ($scope, Structures) {
		function redBlackTree(){
			var svgWidth = 958;
			var svgHeight = 460;
			var vRadius=12;
			tree={cx:300, cy:30, w:40, h:70};

			tree.node={id:0, labeltext:'0', position:{x:tree.cx, y:tree.cy},children:[]};	
			tree.size=1;
			
			tree.getVertices = function(){
				var vertices =[];
				function getVertices(node,parent){
					var copyOfVertex = {id:node.id, labeltext:node.labeltext, position:node.position, parent:parent} 	
					vertices.push(copyOfVertex);	
					node.children.forEach(function(child){
						return getVertices(child,{id:node.id, position:node.position}); 
					});
				}
				getVertices(tree.node,{});
				console.log("vertices", vertices.sort(function(a,b){ return a.id - b.id;}));
				return vertices.sort(function(a,b){ return a.id - b.id;});
			}
			
			tree.getEdges =  function(){
				var edges =[];
				function getEdges(node){
					node.children.forEach(function(child){
						edges.push({parentId:node.id, parentLabel:node.labeltext, parentPosition:node.position, childId:child.id, childLabel:child.labeltext, childPosition:child.position});
					});
					node.children.forEach(getEdges);
				}
				getEdges(tree.node);
				return edges.sort(function(a,b){ return a.childId - b.childId;});	
			}
			
			tree.addLeaf = function(id){
				function addLeaf(node){
					if(node.id==id){
						var newSize = tree.size++
						var newChild = {id:newSize, labeltext:newSize.toString(), position:{},children:[]}
						node.children.push(newChild); 
						return; 
					}
					node.children.forEach(addLeaf);
				}
				addLeaf(tree.node);
				reposition(tree.node);
				redraw();
			}
			
			var redraw = function(){
				var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());
				
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
			
			var getLeafCount = function(_){
				if(_.children.length ==0) return 1;
				else return _.children.map(getLeafCount).reduce(function(a,b){ return a+b;});
			}
			
			var reposition = function(node){
				var leafCount = getLeafCount(node);
				var left=node.position.x - tree.w*(leafCount-1)/2;
				node.children.forEach(function(child){
					var w =tree.w*getLeafCount(child); 
					left+=w; 
					child.position = {x:left-(w+tree.w)/2, y:node.position.y+tree.h};
					reposition(child);
				});		
			}	
			
			var initialize = function(){
				d3.select(".rebalance-container").append("div").attr('id','navdiv');
				
				d3.select("#navdiv").append("nav").attr('id','labelnav').style('display','inline-block').style('visibility','hidden');
						
				d3.select(".rebalance-container").append("svg").attr("width", svgWidth).attr("height", svgHeight).attr('id','treesvg');

				d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;}).attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;}).attr('y2',function(d){ return d.childPosition.y;});

				d3.select("#treesvg").append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices()).enter()
					.append('circle').attr('cx',function(d){ return d.position.x;}).attr('cy',function(d){ return d.position.y;}).attr('r',vRadius)
					.on('click',function(d){return tree.addLeaf(d.id);});
					
				d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
					.attr('x',function(d){ return d.position.x;}).attr('y',function(d){ return d.position.y+5;}).text(function(d){return d.labeltext;})
					.on('click',function(d){return tree.addLeaf(d.id);});	
					
				tree.addLeaf(0);
				tree.addLeaf(0);
			}
			initialize();

			return tree;
		}
		var tree= redBlackTree();
    });
