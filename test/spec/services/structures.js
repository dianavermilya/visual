'use strict';

describe('Service: structures', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var structures;
  beforeEach(inject(function (_structures_) {
    structures = _structures_;
  }));

  it('should do something', function () {
    expect(!!structures).toBe(true);
  });

});
