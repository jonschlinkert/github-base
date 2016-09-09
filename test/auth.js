'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('authentication', function() {
  beforeEach(function() {
    github = new GitHub(auth);
  });

  it('should authenticate with username and password', function(cb) {
    this.timeout(5000);

    var github = new GitHub(auth);
    github.get('/gists', function(err, data) {
      if (err) return cb(err);
      assert(data.length > 0);
      cb();
    });
  });
});
