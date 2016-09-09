'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('.get', function() {
  describe('authentication', function() {
    it('should default to `bad credentials` when they are needed', function(cb) {
      this.timeout(5000);

      github = new GitHub({username: 'bad', password: 'credentials'});
      github.get(`/repos/${auth.username}/fooobarbaz`, function(err, actual) {
        if (err) return cb(err);
        var expected = {
          message: 'Bad credentials',
          documentation_url: 'https://developer.github.com/v3'
        };

        assert.deepEqual(actual, expected);
        cb();
      });
    });

    it('should get resources when unauthenticated', function(cb) {
      this.timeout(5000);

      // unauthenticated
      var github = new GitHub();

      github.get('/repos/:repo/contributors', {
        repo: 'jonschlinkert/github-base'
      }, function(err, data) {
        if (err) return cb(err);
        assert.strictEqual(data.length > 0, true);
        cb();
      });
    });
  });

  describe('data', function() {
    it('should pass placeholders for `path` in constructor options', function(cb) {
      this.timeout(5000);

      var github = new GitHub({
        username: auth.username,
        password: auth.password,
        owner: 'jonschlinkert'
      });

      github.get('/users/:owner/gists', function(err, data) {
        if (err) return cb(err);
        assert(data.length > 5);
        cb();
      });
    });

    it('should pass placeholders for `path` in `data`', function(cb) {
      this.timeout(5000);

      github = new GitHub(auth);
      github.get('/users/:owner/gists', {
        owner: auth.username,
      }, function(err, data) {
        if (err) return cb(err);
        assert(data.length > 10);
        cb();
      });
    });

    it('should merge `options` and `data`', function(cb) {
      this.timeout(5000);

      github = new GitHub(auth);
      github.get('/repos/:owner/:repo', {
        owner: 'jonschlinkert',
        repo: 'github-base'
      }, function(err, data) {
        if (err) return cb(err);
        assert(data);
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(data.name, 'github-base');
        cb();
      });
    });
  });
});
