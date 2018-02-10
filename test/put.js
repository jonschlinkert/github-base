'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.put', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('promise', function() {
    it('should subscribe to repository', function() {
      return github.put('/repos/:owner/:repo/subscription', {
        owner: 'jonschlinkert',
        repo: 'github-base',
        subscribed: true
      })
        .then(function(res) {
          assert(res.body.subscribed);
          assert(!res.body.ignored);
        });
    });

    it('should set content-length to zero (star a gist, status 204)', function() {
      return github.put('/gists/:id/star', { id: '32a6fe359168ecc6f76a' })
        .then(res => {
          assert.strictEqual(res.raw.toString(), '');
          assert.strictEqual(res.body.toString(), '');
          assert.strictEqual(res.statusCode, 204);
        });
    });
  });

  describe('callback', function() {
    it('should subscribe to repository', function(cb) {
      github.put('/repos/:owner/:repo/subscription', {
        owner: 'jonschlinkert',
        repo: 'github-base',
        subscribed: true
      }, function(err, res) {
        if (err) return cb(err);
        assert(res.body.subscribed);
        assert(!res.body.ignored);
        cb();
      });
    });

    it('should set content-length to zero (star a gist, status 204)', function(cb) {
      github.put('/gists/:id/star', { id: '32a6fe359168ecc6f76a' }, function(err, res) {
        if (err) return cb(err);
        assert.strictEqual(res.body.toString(), '');
        assert.strictEqual(res.statusCode, 204);
        cb();
      });
    });
  });
});
