/*
 * grunt-livereload
 * https://github.com/ericclemmons/grunt-livereload
 *
 * Copyright (c) 2013 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var gaze    = require('gaze');
var path    = require('path');
var server  = require('./lib/server.js');

module.exports = function(grunt) {

  var started = false;

  function start() {
    server.listen(function(err) {
      if (err) {
        throw err;
      }

      grunt.log.writeln("LiveReload server " + "started".cyan + " on port " + server.port.toString());

      started = true;
    });
  }

  function refresh(base, filepath) {
    var relative = path.relative(base, filepath);

    server.reload(relative);

    grunt.log.writeln("LiveReload refreshed " + relative.cyan);
  }

  grunt.registerTask('livereload', 'Start/Reload a LiveReload server', function() {
    this.requiresConfig('livereload', 'livereload.files', 'livereload.options.base');

    var config  = grunt.config('livereload');
    var files   = grunt.file.expand(config.files);
    var base    = grunt.file.expand(config.options.base || '.')[0];

    if (started) {
      grunt.log.writeln("LiveReload server " + "already started".magenta);

    } else {
      start();

      gaze(files, function(err) {
        this.on('all', grunt.util._.debounce(function(event, filepath) {
          refresh(base, filepath);
        }, 250));
      });
    }
  });

};
