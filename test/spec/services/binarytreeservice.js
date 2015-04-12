'use strict';

describe('Service: BinaryTreeService', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var BinaryTreeService;
  beforeEach(inject(function (_BinaryTreeService_) {
    BinaryTreeService = _BinaryTreeService_;
  }));

  it('should do something', function () {
    expect(!!BinaryTreeService).toBe(true);
  });

});
