'use strict';

describe('Service: iris', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var iris;
  beforeEach(inject(function (_iris_) {
    iris = _iris_;
  }));

  it('should do something', function () {
    expect(!!iris).toBe(true);
  });

});
