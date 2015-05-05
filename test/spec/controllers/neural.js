'use strict';

describe('Controller: NeuralCtrl', function () {

  // load the controller's module
  beforeEach(module('visualApp'));

  var NeuralCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NeuralCtrl = $controller('NeuralCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
