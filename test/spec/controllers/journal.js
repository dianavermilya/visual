'use strict';

describe('Controller: JournalCtrl', function () {

  // load the controller's module
  beforeEach(module('visualApp'));

  var JournalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JournalCtrl = $controller('JournalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
