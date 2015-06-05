'use strict';

describe('Service: FamilySearch', function () {

  // load the service's module
  beforeEach(module('recordseekApp'));

  // instantiate service
  var FamilySearch;
  beforeEach(inject(function (_FamilySearch_) {
    FamilySearch = _FamilySearch_;
  }));

  it('should do something', function () {
    expect(!!FamilySearch).toBe(true);
  });

});
