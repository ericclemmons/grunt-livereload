'use strict';

var grunt = require('grunt');

exports['livereload'] = {
  'helper': function(test) {
    test.expect(1);
    test.equal(true, true);
    test.done();
  }
};
