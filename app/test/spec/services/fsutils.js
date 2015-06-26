'use strict';

describe('Service: fsUtils', function () {

  // load the service's module
  beforeEach(module('recordseekApp'));

  // instantiate service
  var fsUtils;
  beforeEach(inject(function (_fsUtils_) {
    fsUtils = _fsUtils_;
  }));

  it('should do something', function () {
    expect(!!fsUtils).toBe(true);
  });

});
