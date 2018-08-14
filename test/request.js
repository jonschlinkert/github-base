'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.request', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('PATCH /gists', function() {
    it('should PATCH gist description', function() {
      let id = 'f2bfab45b8eeca457b10b09cc07251bd';
      return github.request('PATCH', `/gists/${id}`, {
        description: JSON.stringify('gist update test ' + new Date())
      })
        .then(res => {
          assert.strictEqual(res.body.id, 'f2bfab45b8eeca457b10b09cc07251bd');
          assert(res.body.url.includes('https://api.github.com/gists/f2bfab45b8eeca457b10b09cc07251bd'));
          assert.strictEqual(res.statusCode, 200);
        });
    });

    describe('GET /gists', function() {
      it('should GET a gist', function() {
        return github.request('GET', '/gists/f2bfab45b8eeca457b10b09cc07251bd')
          .then(res => {
            assert.strictEqual(res.body.id, 'f2bfab45b8eeca457b10b09cc07251bd');
            assert(res.body.url.includes('https://api.github.com/gists/f2bfab45b8eeca457b10b09cc07251bd'));
            assert.strictEqual(res.statusCode, 200);
          });
      });
    });

    describe('PUT /repos', function() {
      it('should unsubscribe from repo with PUT', function() {
        return github.request('PUT', '/repos/jonschlinkert/github-base/subscription', {
          subscribed: false,
          ignored: true
        })
          .then(res => {
            assert(!res.body.subscribed);
            assert(res.body.ignored);
          });
      });
    });

    describe('DELETE /user', function() {
      it('should un-follow a user with DELETE', function() {
        return github.request('DELETE', '/user/following/gisthub')
          .then(res => {
            assert.strictEqual(res.raw.toString(), '');
            assert.strictEqual(res.body.toString(), '');
            assert.strictEqual(res.statusCode, 204);
          });
      });
    });
  });
});
