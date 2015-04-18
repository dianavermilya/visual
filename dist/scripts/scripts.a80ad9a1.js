"use strict";angular.module("visualApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/journal",{templateUrl:"views/journal.html",controller:"JournalCtrl"}).when("/visualizations",{templateUrl:"views/visualizations.html",controller:"VisualizationsCtrl"}).when("/rebalance",{templateUrl:"views/rebalance.html",controller:"RebalanceCtrl"}).when("/redblack",{templateUrl:"views/redblack.html",controller:"RedblackCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("visualApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("JournalCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("VisualizationsCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("visualApp").controller("RebalanceCtrl",["$scope","BinaryTreeService",function(a,b){a.addNode=function(){if(c&&a.addNodeValue){var b=parseInt(a.addNodeValue);c.addNewNodeWithAnimation(b),a.addNodeValue=""}},a.findNode=function(){if(c&&a.findNodeValue){var b=parseInt(a.findNodeValue);c.findNode(b)}a.findNodeValue=""},a.removeNode=function(){if(c&&a.removeNodeValue){var b=parseInt(a.removeNodeValue);c.removeNode(b)}a.removeNodeValue=""};var c=b.getBinaryTree()}]),angular.module("visualApp").controller("RedblackCtrl",["$scope","RedBlackTreeService",function(a,b){a.addNode=function(){if(c&&a.addNodeValue){var b=parseInt(a.addNodeValue);c.addNewNodeWithAnimation(b),a.addNodeValue=""}},a.findNode=function(){if(c&&a.findNodeValue){var b=parseInt(a.findNodeValue);c.findNode(b)}a.findNodeValue=""},a.removeNode=function(){if(c&&a.removeNodeValue){var b=parseInt(a.removeNodeValue);c.removeNode(b)}a.removeNodeValue=""};var c=b.getRedBlackTree()}]),angular.module("visualApp").service("BinaryTreeService",function(){function a(){var a=1e3,b=d3.select(".svg-container").node().getBoundingClientRect().width,c=460,d=12,e={cx:Math.floor(b/2),cy:30,w:60,h:60};e.root={id:0,value:0,position:{x:e.cx,y:e.cy},parent:void 0},e.size=1,e.findNodeWithAnimation=function(b){function c(b,d,e){return b.value==d?(n(b.id,"#79D667",e),e+=a):d<=b.value&&b.left?(n(b.id,"#BCE0FF",e),e=c(b.left,d,e+a)):d>b.value&&b.right?(n(b.id,"#BCE0FF",e),e=c(b.right,d,e+a)):(n(b.id,"#D76C79",e),e+=a),e}return c(e.root,b,0)},e.addNewNode=function(a){var b=f(a);h(b),l(),m()},e.addNewNodeWithAnimation=function(b){var c=f(b);h(c),l();var d=e.findNodeWithAnimation(b);setTimeout(function(){m()},d-a)};var f=function(a){var b=e.size++;return{id:b,value:a,position:{},parent:void 0,color:1}},g=function(a){function b(a,c){return a.value==c?a:c<=a.value&&a.left?b(a.left,c):c>a.value&&a.right?b(a.right,c):void 0}return b(e.root,a)};e.removeNode=function(a){function b(a){return a.right?a.right:a}function c(a){if(a.left&&a.right){var d=b(a.left);a.value=d.value,c(d)}else{var f=a.left?a.left:a.right;a==e.root?e.root=f:a==a.parent.left?a.parent.left=f:a.parent.right=f}}var d=g(a),f=e.findNodeWithAnimation(a);c(d),l(),setTimeout(function(){m()},f)};var h=function(a){function b(b){void 0!=a.value&&(a.value<=b.value?c(b,a):d(b,a))}function c(a,c){a.left?b(a.left):(a.left=c,c.parent=a)}function d(a,c){a.right?b(a.right):(a.right=c,c.parent=a)}e.root?b(e.root):(a.position={x:e.cx,y:e.cy},e.root=a)},i=function(a){var b=0;return a.left||a.right?(a.left&&(b+=i(a.left)),a.right&&(b+=i(a.right))):b=1,b},j=function(){function a(c,d){if(c){var e={id:c.id,value:c.value,position:c.position,parent:d};b.push(e);var f={id:c.id,position:c.position};a(c.left,f),a(c.right,f)}}var b=[];e.root&&a(e.root,{position:{x:e.cx,y:e.cy}});var c=b.sort(function(a,b){return a.id-b.id});return c},k=function(){function a(c){function d(d){d&&(b.push({parentId:c.id,parentPosition:c.position,childId:d.id,childPosition:d.position}),a(d))}d(c.left),d(c.right)}var b=[];return e.root&&a(e.root),b.sort(function(a,b){return a.childId-b.childId})},l=function(){function a(b,c,d){if(b){var f=e.w*i(b);d+=f,b.position={x:d-(f+e.w)/2,y:c.position.y+e.h};var g=i(b),h=b.position.x-e.w*(g-1)/2;h=a(b.left,b,h),h=a(b.right,b,h)}return d}if(e.root){var b=e.root;b.position={x:e.cx,y:e.cy};var c=i(b),d=b.position.x-e.w*(c-1)/2;d=a(b.left,b,d),d=a(b.right,b,d)}},m=function(){var a=d3.select("#g_lines").selectAll("line").data(k(),function(a){return a.childId});a.transition().duration(500).attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.parentPosition.x}).attr("y2",function(a){return a.parentPosition.y}).transition().duration(500).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.exit().remove();var b=d3.select("#g_circles").selectAll("circle").data(j(),function(a){return a.id});b.transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.enter().append("circle").attr("id",function(a){return"name"+a.id}).attr("cx",function(a){return a.parent.position.x}).attr("cy",function(a){return a.parent.position.y}).attr("r",d).transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.classed("selected"),b.exit().remove();var c=d3.select("#g_labels").selectAll("text").data(j(),function(a){return a.id});c.text(function(a){return a.value.toString()}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),c.enter().append("text").attr("x",function(a){return a.parent.position.x}).attr("y",function(a){return a.parent.position.y+5}).text(function(a){return a.value.toString()}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),c.exit().remove()},n=function(b,c,d){var e=d3.select("#g_circles").select("#name"+b),f=d+a;return e.transition().delay(d).style("fill",c).transition().duration(a-500).delay(f-500).style("fill","white"),f},o=function(){d3.select(".svg-container").append("svg").attr("width",b).attr("height",c).attr("id","treesvg");var a=d3.select("#treesvg").append("g").attr("id","g_lines").selectAll("line").data(k(),function(a){return a.childId});a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y});var f=d3.select("#treesvg").append("g").attr("id","g_circles").selectAll("circle").data(j(),function(a){return a.id});f.enter().append("circle").attr("id",function(a){return"name"+a.id}).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}).attr("r",d);var g=d3.select("#treesvg").append("g").attr("id","g_labels").selectAll("text").data(j(),function(a){return a.id});g.enter().append("text").attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}).text(function(a){return a.value.toString()}),e.addNewNode(7),e.addNewNode(5),e.addNewNode(3),e.addNewNode(6),e.addNewNode(12),e.addNewNode(10),e.addNewNode(4),e.addNewNode(8),e.addNewNode(11)};return o(),e}this.getBinaryTree=function(){return a()}}),angular.module("visualApp").service("RedBlackTreeService",function(){function a(){var a=1e3,b=d3.select(".svg-container").node().getBoundingClientRect().width,c=460,d=12,e={cx:Math.floor(b/2),cy:30,w:60,h:60};e.root={id:0,value:8,labeltext:"8",position:{x:e.cx,y:e.cy},parent:void 0,color:1},e.size=1,e.findNodeWithAnimation=function(b){function c(b,d,e){return b.value==d?(r(b.id,"#79D667",e),e+=a):d<=b.value&&b.left?(r(b.id,"#BCE0FF",e),e=c(b.left,d,e+a)):d>b.value&&b.right?(r(b.id,"#BCE0FF",e),e=c(b.right,d,e+a)):(r(b.id,"#D76C79",e),e+=a),e}return c(e.root,b,0)},e.addNewNode=function(a){var b=f(a);i(b),p(),q()},e.addNewNodeWithAnimation=function(b){var c=f(b);i(c),p();var d=e.findNodeWithAnimation(b);setTimeout(function(){q()},d-a)};var f=function(a){var b=e.size++,c={id:b,value:a,labeltext:a.toString(),position:{},left:g(),right:g(),parent:void 0,color:1};return c.left.parent=c,c.right.parent=c,c},g=function(){var a=e.size++;return{id:a,position:{},parent:void 0,color:0,isLeaf:!0}},h=function(a){function b(a,c){return a.value==c?a:c<=a.value&&a.left?b(a.left,c):c>a.value&&a.right?b(a.right,c):void 0}return b(e.root,a)};e.removeNode=function(a){function b(a){return a.right.isLeaf?a:a.right}function c(a){return a==a.parent.left?a.parent.right:a.parent.left}function d(a){a!=e.root&&f(a)}function f(a){var b=c(a);1==b.color&&(a.parent.color=1,b.color=0,a==a.parent.left?m(a.parent):l(a.parent)),g(a)}function g(a){var b=c(a);console.log("node",a),console.log("sibling",b),0==a.parent.color&&0==b.color&&0==b.left.color&&0==b.right.color?(b.color=1,d(a.parent)):i(a)}function i(a){var b=c(a);1==a.parent.color&&0==b.color&&0==b.left.color&&0==b.right.color?(b.color=1,a.parent.color=0):j(a)}function j(a){var b=c(a);0==b.color&&(a==a.parent.left&&0==b.right.color&&1==b.left.color?(b.color=1,b.left.color=0,l(b)):a==a.parent.right&&0==b.left.color&&1==b.right.color&&(b.color=1,b.right.color=0,m(b))),k(a)}function k(a){var b=c(a);b.color=a.parent.color,a.parent.color=0,a==a.parent.left?(b.right.color=0,m(a.parent)):(b.left.color=0,l(a.parent))}function l(a){var b=a.parent,c=a.left;a.left=c.right,a.left.parent=a,c.right=a,c.right.parent=c,c.parent=b,b?b.left==a?b.left=c:b.right=c:e.root=c}function m(a){var b=a.parent,c=a.right;a.right=c.left,a.right.parent=a,c.left=a,c.left.parent=c,c.parent=b,b?b.right==a?b.right=c:b.left=c:e.root=c}function n(a){if(a.left.isLeaf||a.right.isLeaf){var c=a.right.isLeaf?a.left:a.right;a==e.root?e.root=c:a==a.parent.left?(a.parent.left=c,c.parent=a.parent):(a.parent.right=c,c.parent=a.parent),0==a.color&&(1==c.color?c.color=0:d(c))}else{var f=b(a.left);a.value=f.value,a.labeltext=f.labeltext,n(f)}}var o=h(a),r=e.findNodeWithAnimation(a);n(o),p(),setTimeout(function(){q()},r)};var i=function(a){function b(b){void 0!=a.value&&(a.value<=b.value?c(b,a):d(b,a))}function c(a,c){a.left.isLeaf?(a.left=c,c.parent=a,j(c)):b(a.left)}function d(a,c){a.right.isLeaf?(a.right=c,c.parent=a,j(c)):b(a.right)}e.root?b(e.root):(a.position={x:e.cx,y:e.cy},e.root=a,j(e.root))},j=function(a){function b(a){a==e.root?a.color=0:c(a)}function c(a){0!=a.parent.color&&d(a)}function d(a){var c=l(a);if(c&&1==c.color){a.parent.color=0,c.color=0;var d=k(a);d.color=1,b(d)}else f(a)}function f(a){var b=k(a);a==a.parent.right&&a.parent==b.left?(i(a.parent),a=a.left):a==a.parent.left&&a.parent==b.right&&(h(a.parent),a=a.right),g(a)}function g(a){var b=k(a);a.parent.color=0,b.color=1,a==a.parent.left?h(b):i(b)}function h(a){var b=a.parent,c=a.left;a.left=c.right,a.left.parent=a,c.right=a,c.right.parent=c,c.parent=b,b?b.left==a?b.left=c:b.right=c:e.root=c}function i(a){var b=a.parent,c=a.right;a.right=c.left,a.right.parent=a,c.left=a,c.left.parent=c,c.parent=b,b?b.right==a?b.right=c:b.left=c:e.root=c}b(a)},k=function(a){return a.parent&&a.parent.parent?a.parent.parent:void 0},l=function(a){var b=k(a);return b?a.parent==b.left?b.right:b.left:void 0},m=function(a){var b=0;return a.isLeaf?b=1:(b+=m(a.left),b+=m(a.right)),b},n=function(){function a(c,d){var e={id:c.id,labeltext:c.labeltext,position:c.position,parent:d,color:c.color};b.push(e);var f={id:c.id,position:c.position};c.isLeaf||(a(c.left,f),a(c.right,f))}var b=[];e.root&&a(e.root,{position:{x:e.cx,y:e.cy}});var c=b.sort(function(a,b){return a.id-b.id});return c},o=function(){function a(a){a.isLeaf||(b(a.left,a),b(a.right,a))}function b(b,d){c.push({parentId:d.id,parentLabel:d.labeltext,parentPosition:d.position,childId:b.id,childLabel:b.labeltext,childPosition:b.position}),a(b)}var c=[];return e.root&&a(e.root),c.sort(function(a,b){return a.childId-b.childId})},p=function(){function a(b,c,d){var f=e.w*m(b);d+=f,b.position={x:d-(f+e.w)/2,y:c.position.y+e.h};var g=m(b),h=b.position.x-e.w*(g-1)/2;return b.isLeaf||(h=a(b.left,b,h),h=a(b.right,b,h)),d}if(e.root){var b=e.root;b.position={x:e.cx,y:e.cy};var c=m(b),d=b.position.x-e.w*(c-1)/2;d=a(b.left,b,d),a(b.right,b,d)}},q=function(){var a=d3.select("#g_lines").selectAll("line").data(o(),function(a){return a.childId});a.transition().duration(500).attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.parentPosition.x}).attr("y2",function(a){return a.parentPosition.y}).transition().duration(500).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y}),a.exit().remove();var b=d3.select("#g_circles").selectAll("circle").data(n(),function(a){return a.id});b.transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.enter().append("circle").attr("id",function(a){return"name"+a.id}).attr("cx",function(a){return a.parent.position.x}).attr("cy",function(a){return a.parent.position.y}).attr("r",d).transition().duration(500).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}),b.classed("selected"),b.exit().remove(),b=d3.select("#g_circles").selectAll("circle").data(n(),function(a){return a.id}),b.style("fill",function(a){return 0==a.color?"#A9A9A9":"#F08080"});var c=d3.select("#g_labels").selectAll("text").data(n(),function(a){return a.id});c.text(function(a){return a.labeltext}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),c.enter().append("text").attr("x",function(a){return a.parent.position.x}).attr("y",function(a){return a.parent.position.y+5}).text(function(a){return a.labeltext}).transition().duration(500).attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}),c.exit().remove()},r=function(a,b,c){return c},s=function(){e.root.left=g(),e.root.right=g(),j(e.root),p(),d3.select(".svg-container").append("svg").attr("width",b).attr("height",c).attr("id","treesvg");var a=d3.select("#treesvg").append("g").attr("id","g_lines").selectAll("line").data(o(),function(a){return a.childId});a.enter().append("line").attr("x1",function(a){return a.parentPosition.x}).attr("y1",function(a){return a.parentPosition.y}).attr("x2",function(a){return a.childPosition.x}).attr("y2",function(a){return a.childPosition.y});var f=d3.select("#treesvg").append("g").attr("id","g_circles").selectAll("circle").data(n(),function(a){return a.id});f.enter().append("circle").attr("id",function(a){return"name"+a.id}).attr("cx",function(a){return a.position.x}).attr("cy",function(a){return a.position.y}).attr("r",d);var h=d3.select("#treesvg").append("g").attr("id","g_labels").selectAll("text").data(n(),function(a){return a.id});h.enter().append("text").attr("x",function(a){return a.position.x}).attr("y",function(a){return a.position.y+5}).text(function(a){return a.labeltext}),e.addNewNode(7),e.addNewNode(5),e.addNewNode(3),e.addNewNode(6),e.addNewNode(12),e.addNewNode(10),e.addNewNode(4),e.addNewNode(11),p()};return s(),e}this.getRedBlackTree=function(){return a()}});