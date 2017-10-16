'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('.request', function() {
  describe('PATCH /gists', function() {
    beforeEach(function() {
      github = new GitHub(auth);
    });

    it('should change gist description with `PATCH` .request', function(cb) {
      this.timeout(5000);

      github.request('PATCH', '/gists/:id', {
        id: 'f2bfab45b8eeca457b10b09cc07251bd',
        description: 'gist update test ' + Math.random()
      }, function(err, data) {
        if (err) return cb(err);
        assert.strictEqual(data.id, 'f2bfab45b8eeca457b10b09cc07251bd');
        assert.strictEqual(data.url, 'https://api.github.com/gists/f2bfab45b8eeca457b10b09cc07251bd');
        cb();
      });
    });

    describe('GET /gists', function() {
      beforeEach(function() {
        github = new GitHub(auth);
      });

      it('should `GET` single gist with `.request` method', function(cb) {
        this.timeout(5000);

        github.request('GET', '/gists/:id', {
          id: 'f2bfab45b8eeca457b10b09cc07251bd'
        }, function(err, data, stream) {
          if (err) return cb(err);
          assert.strictEqual(data.id, 'f2bfab45b8eeca457b10b09cc07251bd');
          assert.strictEqual(data.url, 'https://api.github.com/gists/f2bfab45b8eeca457b10b09cc07251bd');
          assert.strictEqual(stream.statusCode, 200);
          cb();
        });
      });

      it('should `GET` the gist with `.request` method since 3017', function(cb) {
        this.timeout(5000);

        github.request('GET', '/gists', {
          params: ['since'],
          since: '3017-10-16T09:12:01.280Z'
        }, function(err, data, stream) {
          if (err) return cb(err);
          assert.strictEqual(data.url, 'https://api.github.com/gists?since=2017-10-16T09:12:01.280Z');
          cb();
        });
      });
    });

    describe('PUT /repos', function() {
      beforeEach(function() {
        github = new GitHub(auth);
      });

      it('should unsubscribe from repo with `PUT` .request', function(cb) {
        this.timeout(5000);

        github.request('PUT', '/repos/:owner/:repo/subscription', {
          owner: 'jonschlinkert',
          repo: 'github-base',
          subscribed: false,
          ignored: true
        }, function(err, data) {
          if (err) return cb(err);
          assert(!data.subscribed);
          assert(data.ignored);
          cb();
        });
      });
    });

    describe('DELETE /user', function() {
      beforeEach(function() {
        github = new GitHub(auth);
      });

      it('should un-follow a user with `DELETE` request', function(cb) {
        this.timeout(5000);

        github.request('DELETE', '/user/following/gisthub', function(err, data, stream) {
          if (err) return cb(err);
          assert.strictEqual(typeof data, 'string');
          assert.strictEqual(data, '');
          assert.strictEqual(stream.statusCode, 204);
          cb();
        });
      });
    });
  });
});
