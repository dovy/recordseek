'use strict';

describe('Controller: FsSourceCtrl', function () {

  // load the controller's module
  beforeEach(module('recordseekApp'));

  var FsSourceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FsSourceCtrl = $controller('FsSourceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
