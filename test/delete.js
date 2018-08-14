'use strict';

require('mocha');
const assert = require('assert');
const typeOf = require('kind-of');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.delete', function() {
  this.timeout(10000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('DELETE /user/', function() {
    it('should un-follow a user', function() {
      return github.delete('/user/following/jonschlinkert')
        .then(res => {
          // assert.strictEqual(typeOf(res.body), 'buffer');
          // assert.strictEqual(res.body.toString(), '');
          // assert.strictEqual(res.statusCode, 204);
        });
    });
  });
});
