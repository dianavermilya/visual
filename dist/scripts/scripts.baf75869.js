"use strict";angular.module("visualApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/journal",{templateUrl:"views/journal.html",controller:"JournalCtrl"}).when("/visualizations",{templateUrl:"views/visualizations.html",controller:"VisualizationsCtrl"}).when("/rebalance",{templateUrl:"views/rebalance.html",controller:"RebalanceCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("visualApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("JournalCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("VisualizationsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("RebalanceCtrl",["$scope",function(a){function b(){var a=1e3,b=d3.select(".rebalance-svg-container").node().getBoundingClientRect().width,d=460,e=12;c={cx:Math.floor(b/2),cy:30,w:60,h:60},c.root={id:0,value:0,labeltext:"0",position:{x:c.cx,y:c.cy},children:{}},c.size=1,c.getVertices=function(){function a(c,d){if(c){var e={id:c.id,labeltext:c.labeltext,position:c.position,parent:d};b.push(e);var f={id:c.id,position:c.position};a(c.children.leftChild,f),a(c.children.rightChild,f)}}var b=[];c.root&&a(c.root,{position:{x:c.cx,y:c.cy}});var d=b.sort(function(a,b){return a.id-b.id});return d},c.getEdges=function(){function a(c){function d(d){d&&(b.push({parentId:c.id,parentLabel:c.labeltext,parentPosition:c.position,childId:d.id,childLabel:d.labeltext,childPosition:d.position}),a(d))}d(c.children.leftChild),d(c.children.rightChild)}var b=[];return c.root&&a(c.root),b.sort(function(a,b){return a.childId-b.childId})},c.findNode=function(b){function d(b,e,f){return b.value==e?(c.highlightCircle(b.id,"#79D667",f),f+=a):e<=b.value&&b.children.leftChild?(c.highlightCircle(b.id,"#BCE0FF",f),f=d(b.children.leftChild,e,f+a)):e>b.value&&b.children.rightChild?(c.highlightCircle(b.id,"#BCE0FF",f),f=d(b.children.rightChild,e,f+a)):(c.highlightCircle(b.id,"#D76C79",f),f+=a),f}return d(c.root,b,0)},c.highlightCircle=function(b,c,d){var e=d3.select("#g_circles").select("#name"+b),f=d+a;return e.transition().delay(d).style("fill",c).transition().duration(a-500).delay(f-500).style("fill","white"),f},c.addLeaf=function(a){var b=c.size++,d={id:b,value:a,labeltext:a.toString(),position:{},children:{}};c.addNode(d),h(),f()},c.addLeafWithAnimation=function(b){var d=c.size++,e={id:d,value:b,labeltext:b.toString(),position:{},children:{}};c.addNode(e),h();var g=c.findNode(b);setTimeout(function(){f()},g-a)},c.addNode=function(a){function b(b){void 0!=a.value&&(a.value<=b.value?d(b,a):e(b,a))}function d(a,c){a.children.leftChild?b(a.children.leftChild):a.children.leftChild=c}function e(a,c){a.children.rightChild?b(a.children.rightChild):a.children.rightChild=c}c.root?b(c.root):(a.position={x:c.cx,y:c.cy},c.root=a)},c.removeNode=function(a){function b(a,d,e,f){return a.value==d?(e?delete e.children[f]:c.root=null,a.children.leftChild&&c.addNode(a.children.leftChild),a.children.rightChild&&c.addNode(a.children.rightChild),a):d<=a.value&&a.children.leftChild?b(a.children.leftChild,d,a,"leftChild"):d>a.value&&a.children.rightChild?b(a.children.rightChild,d,a,"rightChild"):!1}if(c.root){var d=c.findNode(a);b(c.root,a),h(),setTimeout(function(){f()},d)}};var f=function(){var a=d3.select("#g_lines").selectAll("line").data(c.getEdges(),function(a){return a.childId});a.transition().duration(500).attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.parentPosition.x}).attr("y2",function(a){return a.parentPosition.y}).transition().duration(500).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.exit().remove();var b=d3.select("#g_circles").selectAll("circle").data(c.getVertices(),function(a){return a.id});b.transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.enter().append("circle").attr("id",function(a){return"name"+a.id}).attr("cx",function(a){return a.parent.position.x}).attr("cy",function(a){return a.parent.position.y}).attr("r",e).transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.classed("selected"),b.exit().remove();var d=d3.select("#g_labels").selectAll("text").data(c.getVertices(),function(a){return a.id});d.text(function(a){return a.labeltext}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),d.enter().append("text").attr("x",function(a){return a.parent.position.x}).attr("y",function(a){return a.parent.position.y+5}).text(function(a){return a.labeltext}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),d.exit().remove()},g=function(a){var b=0;return a.children.leftChild||a.children.rightChild?(a.children.leftChild&&(b+=g(a.children.leftChild)),a.children.rightChild&&(b+=g(a.children.rightChild))):b=1,b},h=function(){function a(b,d,e){if(b){var f=c.w*g(b);e+=f,b.position={x:e-(f+c.w)/2,y:d.position.y+c.h};var h=g(b),i=b.position.x-c.w*(h-1)/2;i=a(b.children.leftChild,b,i),i=a(b.children.rightChild,b,i)}return e}if(c.root){var b=c.root;b.position={x:c.cx,y:c.cy};var d=g(b),e=b.position.x-c.w*(d-1)/2;e=a(b.children.leftChild,b,e),e=a(b.children.rightChild,b,e)}},i=function(){d3.select(".rebalance-svg-container").append("svg").attr("width",b).attr("height",d).attr("id","treesvg");var a=d3.select("#treesvg").append("g").attr("id","g_lines").selectAll("line").data(c.getEdges(),function(a){return a.childId});a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y});var f=d3.select("#treesvg").append("g").attr("id","g_circles").selectAll("circle").data(c.getVertices(),function(a){return a.id});f.enter().append("circle").attr("id",function(a){return"name"+a.id}).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}).attr("r",e);var g=d3.select("#treesvg").append("g").attr("id","g_labels").selectAll("text").data(c.getVertices(),function(a){return a.id});g.enter().append("text").attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}).text(function(a){return a.labeltext}),c.addLeaf(7),c.addLeaf(5),c.addLeaf(3),c.addLeaf(6),c.addLeaf(12),c.addLeaf(10),c.addLeaf(4),c.addLeaf(8),c.addLeaf(11)};return i(),c}a.addNode=function(){if(c&&a.addNodeValue){var b=parseInt(a.addNodeValue);c.addLeafWithAnimation(b),a.addNodeValue=""}},a.findNode=function(){if(c&&a.findNodeValue){var b=parseInt(a.findNodeValue);c.findNode(b)}a.findNodeValue=""},a.removeNode=function(){if(c&&a.removeNodeValue){var b=parseInt(a.removeNodeValue);c.removeNode(b)}a.removeNodeValue=""};var c=b()}]);