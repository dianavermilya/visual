"use strict";angular.module("visualApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/journal",{templateUrl:"views/journal.html",controller:"JournalCtrl"}).when("/visualizations",{templateUrl:"views/visualizations.html",controller:"VisualizationsCtrl"}).when("/rebalance",{templateUrl:"views/rebalance.html",controller:"RebalanceCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("visualApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("JournalCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("VisualizationsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("RebalanceCtrl",["$scope",function(a){function b(){var a=d3.select(".rebalance-svg-container").node().getBoundingClientRect().width,b=460,d=12;c={cx:Math.floor(a/2),cy:30,w:60,h:60},c.root={id:0,value:0,labeltext:"0",position:{x:c.cx,y:c.cy},children:{}},c.size=1,c.getVertices=function(){function a(c,d){if(c){var e={id:c.id,labeltext:c.labeltext,position:c.position,parent:d};b.push(e);var f={id:c.id,position:c.position};a(c.children.leftChild,f),a(c.children.rightChild,f)}}var b=[];c.root&&a(c.root,{position:{x:c.cx,y:c.cy}});var d=b.sort(function(a,b){return a.id-b.id});return console.log(d),d},c.getEdges=function(){function a(c){function d(d){d&&(b.push({parentId:c.id,parentLabel:c.labeltext,parentPosition:c.position,childId:d.id,childLabel:d.labeltext,childPosition:d.position}),a(d))}d(c.children.leftChild),d(c.children.rightChild)}var b=[];return c.root&&a(c.root),b.sort(function(a,b){return a.childId-b.childId})},c.findNode=function(a){function b(a,c){return a.value==c?a:c<=a.value&&a.children.leftChild?b(a.children.leftChild,c):c>a.value&&a.children.rightChild?b(a.children.rightChild,c):!1}return b(c.root,a)},c.addLeaf=function(a){var b=c.size++,d={id:b,value:a,labeltext:a.toString(),position:{},children:{}};c.addNode(d),g(),e()},c.addNode=function(a){function b(b){void 0!=a.value&&(a.value<=b.value?d(b,a):e(b,a))}function d(a,c){a.children.leftChild?b(a.children.leftChild):a.children.leftChild=c}function e(a,c){a.children.rightChild?b(a.children.rightChild):a.children.rightChild=c}c.root?b(c.root):(a.position={x:c.cx,y:c.cy},c.root=a)},c.removeNode=function(a){function b(a,d,e,f){return a.value==d?(e?delete e.children[f]:c.root=null,a.children.leftChild&&c.addNode(a.children.leftChild),a.children.rightChild&&c.addNode(a.children.rightChild),a):d<=a.value&&a.children.leftChild?b(a.children.leftChild,d,a,"leftChild"):d>a.value&&a.children.rightChild?b(a.children.rightChild,d,a,"rightChild"):!1}c.root&&(b(c.root,a),g(),e())};var e=function(){var a=d3.select("#g_lines").selectAll("line").data(c.getEdges(),function(a){return a.childId});console.log(a),a.transition().duration(500).attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.parentPosition.x}).attr("y2",function(a){return a.parentPosition.y}).transition().duration(500).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.exit().remove();var b=d3.select("#g_circles").selectAll("circle").data(c.getVertices(),function(a){return a.id});b.transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.enter().append("circle").attr("cx",function(a){return a.parent.position.x}).attr("cy",function(a){return a.parent.position.y}).attr("r",d).transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.exit().remove();var e=d3.select("#g_labels").selectAll("text").data(c.getVertices(),function(a){return a.id});e.text(function(a){return a.labeltext}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),e.enter().append("text").attr("x",function(a){return a.parent.position.x}).attr("y",function(a){return a.parent.position.y+5}).text(function(a){return a.labeltext}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),e.exit().remove()},f=function(a){var b=0;return a.children.leftChild||a.children.rightChild?(a.children.leftChild&&(b+=f(a.children.leftChild)),a.children.rightChild&&(b+=f(a.children.rightChild))):b=1,b},g=function(){function a(b,d,e){if(b){var g=c.w*f(b);e+=g,b.position={x:e-(g+c.w)/2,y:d.position.y+c.h};var h=f(b),i=b.position.x-c.w*(h-1)/2;i=a(b.children.leftChild,b,i),i=a(b.children.rightChild,b,i)}return e}if(c.root){var b=c.root;b.position={x:c.cx,y:c.cy};var d=f(b),e=b.position.x-c.w*(d-1)/2;e=a(b.children.leftChild,b,e),e=a(b.children.rightChild,b,e)}},h=function(){d3.select(".rebalance-svg-container").append("svg").attr("width",a).attr("height",b).attr("id","treesvg");var e=d3.select("#treesvg").append("g").attr("id","g_lines").selectAll("line").data(c.getEdges(),function(a){return a.childId});e.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y});var f=d3.select("#treesvg").append("g").attr("id","g_circles").selectAll("circle").data(c.getVertices(),function(a){return a.id});f.enter().append("circle").attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}).attr("r",d);var g=d3.select("#treesvg").append("g").attr("id","g_labels").selectAll("text").data(c.getVertices(),function(a){return a.id});g.enter().append("text").attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}).text(function(a){return a.labeltext})};return h(),c}a.addNode=function(){if(c&&a.addNodeValue){var b=parseInt(a.addNodeValue);c.addLeaf(b),a.addNodeValue=""}},a.findNode=function(){if(c&&a.findNodeValue){var b=parseInt(a.findNodeValue),d=c.findNode(b);console.log(d)}a.findNodeValue=""},a.removeNode=function(){if(c&&a.removeNodeValue){var b=parseInt(a.removeNodeValue);c.removeNode(b)}a.removeNodeValue=""};var c=b()}]);