'use strict';

describe('Service: neuralnetservice', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var neuralnetservice;
  beforeEach(inject(function (_neuralnetservice_) {
    neuralnetservice = _neuralnetservice_;
  }));

  it('should do something', function () {
    expect(!!neuralnetservice).toBe(true);
  });

});
