'use strict';
/**
 * @ngdoc service
 * @name visualApp.neuralnetservice
 * @description
 * # neuralnetservice
 * Service in the visualApp.
 */
angular.module('visualApp')
  	.service('NeuralNetService', function (IrisDataService) {
    // AngularJS will instantiate a singleton by calling "new" on this function

		function NeuralNet(){
			var svgWidth = d3.select(".svg-container").node().getBoundingClientRect().width;
			var svgHeight = 700;
			var cRadius=30;
			var numInputs = 2;
			var numMidNodes0 = 6;
			var numMidNodes1 = 2;
			var numOutputs = 2;
			var inputs = [];
			var midNodes0 = [];
			var midNodes1 = [];
			var outputs = [];
			var edges = [];
			var dot_data = [];
			var dot_labels = [];
			var net;

			var makeNodes = function() {
				var nodeId = 0;

				var makeRow = function(count, y, name) {
					var dist_betw_circles = 120;
					var dist_betw_circle_centers =cRadius*2+dist_betw_circles;
					var total_x = cRadius*count*2+dist_betw_circles*(count-1);
					var circles = [];
					var xPosStart = svgWidth/2.0-(total_x/2.0) + cRadius;
					for (var i=0;i<count;i++) {
						var xPos = Math.floor(xPosStart+i*dist_betw_circle_centers);
						circles.push({cx:xPos, cy:y, w:cRadius, h:cRadius, id:(name + " " + i.toString())});
					}
					return circles;
				};

				inputs = makeRow(numInputs, 60, "inputs");
				midNodes0 = makeRow(numMidNodes0, 200, "midNodes0");
				midNodes1 = makeRow(numMidNodes1, 340, "midNodes1");
				outputs = makeRow(numOutputs, 480, "outputs");
			};

			function findChildEnd(parent, child, strokewidth) {

				var xlen = child.cx - parent.cx;
				var ylen = child.cy - parent.cy;
				var r = Math.sqrt(xlen*xlen + ylen*ylen);
				var theta = Math.atan2(ylen, xlen);
				r = r-cRadius-(strokewidth*3);
				xlen = r*Math.cos(theta);
				ylen = r*Math.sin(theta);
				var childPosition = {
					x: parent.cx+xlen,
					y: parent.cy+ylen
				};
				return childPosition
			};

			var makeEdges = function(parents, children) {
				var getRowOfEdges = function(parents, children) {
					var edges = [];
					angular.forEach(parents, function(parent) {
						angular.forEach(children, function(child) {
							edges.push({
								parentPosition: {
									x: parent.cx,
									y: parent.cy
								},
								childPosition: findChildEnd(parent, child, 3),
								id: parent.id + " " + child.id.split(" ")[1],
								parent: parent,
								child: child
							});
						});
					}); 
					return edges;
				};
				var row1 = getRowOfEdges(inputs, midNodes0);
				var row2 = getRowOfEdges(midNodes0, midNodes1);
				var row3 = getRowOfEdges(midNodes1, outputs);

				edges = row1.concat(row2).concat(row3);
			};

			var getEdges = function() {
				return edges;
			};

			var getNodes = function() {
				var allNodes = inputs.concat(midNodes0).concat(midNodes1).concat(outputs);
				return allNodes;
			};


			function make_spiral_data() {
				dot_data = [];
				dot_labels = [];
			  	var n = 100;
				for(var i=0;i<n;i++) {
					var r = i/n*5 + convnetjs.randf(-0.1, 0.1);
					var t = 1.25*i/n*2*Math.PI + convnetjs.randf(-0.1, 0.1);
					dot_data.push([r*Math.sin(t), r*Math.cos(t)]);
					dot_labels.push(1);
				}
				for(var i=0;i<n;i++) {
					var r = i/n*5 + convnetjs.randf(-0.1, 0.1);
					var t = 1.25*i/n*2*Math.PI + Math.PI + convnetjs.randf(-0.1, 0.1);
					dot_data.push([r*Math.sin(t), r*Math.cos(t)]);
					dot_labels.push(0);
				}
			}

			function make_circle_data() {
				dot_data = [];
				dot_labels = [];
			  	for(var i=0;i<100;i++) {
			    	var r = convnetjs.randf(0.0, 2.0);
			    	var t = convnetjs.randf(0.0, 2*Math.PI);
			    	dot_data.push([r*Math.sin(t), r*Math.cos(t)]);
			    	dot_labels.push(1);
			  	}
			  	for(var i=0;i<100;i++) {
			    	var r = convnetjs.randf(3.0, 5.0);
			    	//var t = convnetjs.randf(0.0, 2*Math.PI);
			    	var t = 2*Math.PI*i/50.0
			    	dot_data.push([r*Math.sin(t), r*Math.cos(t)]);
			    	dot_labels.push(0);
			  	}
			}

			function redraw_graph() {

				var x = d3.select("#treesvg");

				function transpose(array) {
					return array[0].map(function(col, i) { 
					  return array.map(function(row) { 
					    return row[i] 
					  })
					});
				};

				function twoDMax(arr) {
					return Math.max.apply(Math, arr.map(function(v) {
						return Math.max.apply(null, v);
					}));
				};

				function twoDMin(arr) {
					return Math.min.apply(Math, arr.map(function(v) {
						return Math.min.apply(null, v);
					}));
				};

				function reweight(arr) {
					var min = twoDMin(arr);
					var max = twoDMax(arr);
					return arr.map(function(row, i) {
						return row.map(function(el, j) {
							return (el+(min*(-1)))*(10/(max-min))+1;
						});
					});
				};

				function getWeights(n) {
					var weights = []
					var fc = net.layers[n];
					var A = new convnetjs.Vol(1,1,fc.out_depth,0.0);
					var in_act_w = fc.in_act.w;

					//for each of the outputs nodes
					for (var i=0; i<fc.out_depth; i++) {
						var weight_row = [];
						var sum = 0.0;
						var wi = fc.filters[i].w;
						//for each of the inputs
						for (var j=0;j<fc.num_inputs; j++) {
							//add in the product of weight and value
							sum+= in_act_w[j]*wi[j];
							weight_row.push(in_act_w[j]*wi[j])
						}
						//add in bias
						sum+=fc.biases.w[i];
						A.w[i] = sum;
						weights.push(weight_row);
					}
					return weights;
				};

				var weights = {
					"inputs": reweight(transpose(getWeights(1))),
					"midNodes0": reweight(transpose(getWeights(3))),
					"midNodes1": reweight(transpose(getWeights(5)))
				};


				var arrow_lines = d3.select("#arrow_lines").selectAll('line');
				arrow_lines
					.attr('stroke-width', function(d){
						var ids = d.id.split(" ");
						var weightRow = weights[ids[0]];
						var weight = weightRow[parseInt(ids[1])][parseInt(ids[2])];
						var strokeWidth = weight.toString();
						d.strokeWidth = parseFloat(strokeWidth);
						return strokeWidth;
					})
					.attr('x2', function(d) {
						return findChildEnd(d.parent, d.child, d.strokeWidth).x;
					})
					.attr('y2', function(d) {
						return findChildEnd(d.parent, d.child, d.strokeWidth).y;
					});
				};

			function makeNeuralAlg () {
				var test_dot = new convnetjs.Vol([-2.7647368600411255, 1.8821490267965022]);

				 
				var probability_volume = net.forward(test_dot);
				console.log(probability_volume);
				var trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.1, batch_size:10, l2_decay:0.001});

				var iris_data = IrisDataService.getIrisData();
				var scores, className, idx, data, className
  				var x = new convnetjs.Vol(1,1,2);

  				function train(i){
  					console.log("running");
  					for (var ix=0; ix<200; ix++) {
  						x.w = dot_data[ix];
  						className = dot_labels[ix];
  						trainer.train(x, className);
  					}
  					if (i%10 ==0) {
  						redraw_graph();
  					}
  				}

				(function myLoop (i) {          
				   	setTimeout(function () { 
				   		train(i);
				    	if (--i) myLoop(i);      //  decrement i and call myLoop again if i > 0
				   	}, 10)
				})(1000); //times to run the entire training set

				setTimeout(function() {
					scores = net.forward(test_dot);
					console.log(scores);	
				}, 25000);
			}



			var initialize = function(){
				make_spiral_data()

				var layer_defs = [];
				layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
				layer_defs.push({type:'fc', num_neurons:6, activation: 'tanh'});
				layer_defs.push({type:'fc', num_neurons:2, activation: 'tanh'});
				layer_defs.push({type:'softmax', num_classes:2});


				// create a net out of it
				net = new convnetjs.Net();
				net.makeLayers(layer_defs);

				makeNodes();
				makeEdges();


				d3.select(".svg-container").append("svg")
					.attr("width", svgWidth)
					.attr("height", svgHeight)
					.attr('id','treesvg');
				d3.select("#treesvg").append('marker')
					.attr('id', 'triangle')
					.attr('viewBox', "0 0 10 10")
					.attr('refX', "0")
					.attr('refY', "5")
					.attr('markerUnits', "strokeWidth")
					.attr('markerWidth', "4")
					.attr('markerHeight', "3")
					.attr("orient", "auto")
					.append("svg:path")
						.attr("d", "M 0 0 L 10 5 L 0 10 z")
						.attr("fill", "context-stroke");

				var arrow_lines = d3.select("#treesvg").append('g').attr('id','arrow_lines').selectAll('line').data(getEdges(), function(d){return d.id});
				arrow_lines.enter().append('line')
					.attr('x1',function(d){ return d.parentPosition.x;})
					.attr('y1',function(d){ return d.parentPosition.y;})
					.attr('x2',function(d){ return d.childPosition.x;})
					.attr('y2',function(d){ return d.childPosition.y;})
					.attr('class', "cat")
					.attr("marker-end", "url(#triangle)");
				var x = d3.select("#treesvg");

				var circles = d3.select("#treesvg").append('g').attr('id','circles').selectAll('circle').data(getNodes(), function(d){return d.id});
				circles.enter().append('circle')
					.attr('id', function(d){return 'name' + d.id})
					.attr('cx',function(d){ return d.cx;})
					.attr('cy',function(d){ return d.cy;})
					.attr('r',cRadius)
					
				var labels = d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text').data(getNodes(), function(d){return d.id})
				labels.enter().append('text')
					.attr('x',function(d){ return 0;})
					.attr('y',function(d){ return 0;})
					.text(function(d){return "";})

				makeNeuralAlg()
			};

			initialize();
		}

		this.getNeuralNet = function() {
			return NeuralNet()
		};

	});
