'use strict';

describe('Service: source', function () {

  // load the service's module
  beforeEach(module('recordseekApp'));

  // instantiate service
  var source;
  beforeEach(inject(function (_source_) {
    source = _source_;
  }));

  it('should do something', function () {
    expect(!!source).toBe(true);
  });

});
