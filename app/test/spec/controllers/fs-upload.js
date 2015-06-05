'use strict';

describe('Controller: FsUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('recordseekApp'));

  var FsUploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FsUploadCtrl = $controller('FsUploadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
