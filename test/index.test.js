'use strict';

var expect = require('expect');

var glup = require('../');

describe('glup', function() {

  describe('hasOwnProperty', function() {
    it('src', function(done) {
      expect(glup.hasOwnProperty('src')).toEqual(true);
      done();
    });

    it('dest', function(done) {
      expect(glup.hasOwnProperty('dest')).toEqual(true);
      done();
    });

    it('symlink', function(done) {
      expect(glup.hasOwnProperty('symlink')).toEqual(true);
      done();
    });

    it('watch', function(done) {
      expect(glup.hasOwnProperty('watch')).toEqual(true);
      done();
    });

    it('task', function(done) {
      expect(glup.hasOwnProperty('task')).toEqual(true);
      done();
    });

    it('series', function(done) {
      expect(glup.hasOwnProperty('series')).toEqual(true);
      done();
    });

    it('parallel', function(done) {
      expect(glup.hasOwnProperty('parallel')).toEqual(true);
      done();
    });

    it('tree', function(done) {
      expect(glup.hasOwnProperty('tree')).toEqual(true);
      done();
    });

    it('lastRun', function(done) {
      expect(glup.hasOwnProperty('lastRun')).toEqual(true);
      done();
    });

    it('registry', function(done) {
      expect(glup.hasOwnProperty('registry')).toEqual(true);
      done();
    });
  });
});
