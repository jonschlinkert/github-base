'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('.del', function() {
  describe('DELETE /user/', function() {
    beforeEach(function() {
      github = new GitHub(auth);
    });

    it('should un-follow a user', function(cb) {
      this.timeout(5000);

      github.del('/user/following/node', function(err, data, stream) {
        if (err) return cb(err);
        assert.strictEqual(typeof data, 'string');
        assert.strictEqual(data, '');
        assert.strictEqual(stream.statusCode, 204);
        cb();
      });
    });
  });
});
