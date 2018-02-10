'use strict';

require('mocha');
const assert = require('assert');
const typeOf = require('kind-of');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.del', function() {
  this.timeout(10000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('DELETE /user/', function() {
    it('should un-follow a user', function() {
      return github.del('/user/following/node')
        .then(res => {
          assert.strictEqual(typeOf(res.body), 'buffer');
          assert.strictEqual(res.body.toString(), '');
          assert.strictEqual(res.statusCode, 204);
        });
    });
  });
});
