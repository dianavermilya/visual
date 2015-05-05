'use strict';

describe('Service: IrisDataService', function () {

  // load the service's module
  beforeEach(module('visualApp'));

  // instantiate service
  var IrisDataService;
  beforeEach(inject(function (_IrisDataService_) {
    IrisDataService = _IrisDataService_;
  }));

  it('should do something', function () {
    expect(!!IrisDataService).toBe(true);
  });

});
