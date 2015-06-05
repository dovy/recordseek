'use strict';

describe('Service: rsData', function () {

  // load the service's module
  beforeEach(module('recordseekApp'));

  // instantiate service
  var rsData;
  beforeEach(inject(function (_rsData_) {
    rsData = _rsData_;
  }));

  it('should do something', function () {
    expect(!!rsData).toBe(true);
  });

});
