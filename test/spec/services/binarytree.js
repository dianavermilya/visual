'use strict';

describe('Service: binaryTree', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var binaryTree;
  beforeEach(inject(function (_binaryTree_) {
    binaryTree = _binaryTree_;
  }));

  it('should do something', function () {
    expect(!!binaryTree).toBe(true);
  });

});
