'use strict';

describe('Service: fsCurrentUserCache', function () {

  // load the service's module
  beforeEach(module('recordseekApp'));

  // instantiate service
  var fsCurrentUserCache;
  beforeEach(inject(function (_fsCurrentUserCache_) {
    fsCurrentUserCache = _fsCurrentUserCache_;
  }));

  it('should do something', function () {
    expect(!!fsCurrentUserCache).toBe(true);
  });

});
