'use strict';

describe('Controller: RedblackCtrl', function () {

  // load the controller's module
  beforeEach(module('visualApp'));

  var RedblackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RedblackCtrl = $controller('RedblackCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
