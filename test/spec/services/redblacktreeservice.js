'use strict';

describe('Service: RedBlackTreeService', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var RedBlackTreeService;
  beforeEach(inject(function (_RedBlackTreeService_) {
    RedBlackTreeService = _RedBlackTreeService_;
  }));

  it('should do something', function () {
    expect(!!RedBlackTreeService).toBe(true);
  });

});
