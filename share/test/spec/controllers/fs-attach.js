'use strict';

describe('Controller: FsAttachCtrl', function () {

  // load the controller's module
  beforeEach(module('recordseekApp'));

  var FsAttachCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FsAttachCtrl = $controller('FsAttachCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
