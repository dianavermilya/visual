'use strict';

describe('Controller: VisualizationsCtrl', function () {

  // load the controller's module
  beforeEach(module('visualApp'));

  var VisualizationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VisualizationsCtrl = $controller('VisualizationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
