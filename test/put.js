'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('.put', function() {
  beforeEach(function() {
    github = new GitHub(auth);
  });

  it('should subscribe to repository', function(cb) {
    this.timeout(5000);

    github.put('/repos/:owner/:repo/subscription', {
      owner: 'jonschlinkert',
      repo: 'github-base',
      subscribed: true
    }, function(err, data) {
      if (err) return cb(err);
      assert(data.subscribed);
      assert(!data.ignored);
      cb();
    });
  });

  it('should subscribe to repository', function(cb) {
    this.timeout(5000);

    github.put('/repos/:owner/:repo/subscription', {
      owner: 'jonschlinkert',
      repo: 'github-base',
      subscribed: true
    }, function(err, data) {
      if (err) return cb(err);
      assert(data.subscribed);
      assert(!data.ignored);
      cb();
    });
  });

  it('should set content-length to zero (star a gist, status 204)', function(cb) {
    this.timeout(5000);

    github.put('/gists/:id/star', {
      id: '32a6fe359168ecc6f76a'
    }, function(err, data, stream) {
      if (err) return cb(err);
      assert.strictEqual(typeof data, 'string');
      assert.strictEqual(data, '');
      assert.strictEqual(stream.statusCode, 204);
      cb();
    });
  });
});
