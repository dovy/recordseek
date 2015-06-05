'use strict';

describe('Controller: FsAddpersonCtrl', function () {

  // load the controller's module
  beforeEach(module('recordseekApp'));

  var FsAddpersonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FsAddpersonCtrl = $controller('FsAddpersonCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
