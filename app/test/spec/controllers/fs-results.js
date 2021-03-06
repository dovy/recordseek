'use strict';

describe('Controller: FsResultsCtrl', function () {

  // load the controller's module
  beforeEach(module('recordseekApp'));

  var FsResultsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FsResultsCtrl = $controller('FsResultsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
