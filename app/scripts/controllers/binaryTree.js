var prompt = require('prompt');


function Node(value) {

	this.value = value;
	var leftChild;
	var rightChild;

	this.getLeftChild = function() {
		return leftChild;
	};

	this.getRightChild = function() {
		return rightChild;
	};

	this.addChildNode = function (childNode) {
		if (childNode.value != undefined) {
			if (childNode.value <= this.value) {
				addLeftChild(childNode)
			} else {
				addRightChild(childNode)
			}
		}
	};

	this.printTree = function () {
	if (this.getLeftChild()) {
		this.getLeftChild().printTree();
	}
	console.log(this.value);
	if (this.getRightChild()) {
		this.getRightChild().printTree();
	}
}

	function addLeftChild(childNode) {
		if (!leftChild) {
			leftChild = childNode;
		} else {
			leftChild.addChildNode(childNode)
		}
	}

	function addRightChild(childNode) {
		if (!rightChild) {
			rightChild = childNode
		} else {
			rightChild.addChildNode(childNode)
		}
	}
}

function Tree () {

	this.head;

	this.insert = function (n) {
		var node = new Node(n);
		if (!this.head) {
			this.head = node;
		} else {
			this.head.addChildNode(node);
		}
	};

	this.printTree = function() {
		this.head.printTree();
	};
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function makeRandomTree(min, max, numNodes) {
	if (typeof(min)==='undefined') min = 10;
	if (typeof(max)==='undefined') max = 100;
	if (typeof(numNodes)==='undefined') numNodes = 20;

	var tree = new Tree();
	var val;
	var n=0;
	for (var i=0;i<numNodes;i++) {
		val = Math.floor(Math.random()*(max-min)+min);
		tree.insert(val);
	}
	return tree;
}

function makeSpecificTree() {
	var tree = new Tree();
	tree.insert(10);
	tree.insert(6);
	tree.insert(4);
	tree.insert(3);
	tree.insert(11);
	tree.insert(100);
	tree.insert(80);
	tree.insert(7);
	return tree;
}



var specific_tree = makeSpecificTree();
specific_tree.printTree();
var random_tree = makeRandomTree();
random_tree.printTree();




	