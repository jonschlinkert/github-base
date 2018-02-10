'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('authentication', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  it('should authenticate with username and password', function() {
    return github.get('/gists').then(res => assert(res.body.length > 0));
  });

  it('should take a callback', function(cb) {
    github.get('/gists', function(err, res) {
      if (err) return cb(err);
      assert(res.body.length > 0);
      cb();
    });
  });
});
