'use strict';

describe('Controller: FsSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('recordseekApp'));

  var FsSearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FsSearchCtrl = $controller('FsSearchCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
