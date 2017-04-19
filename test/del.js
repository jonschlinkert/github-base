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
      this.timeout(20000);

      github.del('/user/following/node', function(err, data, stream) {
        if (err) {
          cb(err);
          return;
        }
        assert.strictEqual(typeof data, 'string');
        assert.strictEqual(data.toString(), '');
        assert.strictEqual(stream.statusCode, 204);
        cb();
      });
    });
  });
});
