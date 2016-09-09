'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('.post', function() {
  describe('POST /markdown and /markdown/raw', function() {
    beforeEach(function() {
      github = new GitHub(auth);
    });

    it('should work with `/markdown` endpoint', function(cb) {
      this.timeout(10000);

      github.post('/markdown', {
        json: false,
        text: 'foo **bar** baz!',
        mode: 'gfm',
        headers: {
          'content-type': 'application/json'
        }
      }, function(err, data, stream) {
        if (err) return cb(err);
        assert(data.indexOf(`https://github.com/${auth.username}`));
        assert.strictEqual(stream.statusCode, 200);
        cb();
      });
    });

    it('should pass raw body to `/markdown/raw`', function(cb) {
      this.timeout(5000);

      GitHub({
        json: false,
        username: auth.username,
        password: auth.password,
        body: 'foo **bar** #1',
        headers: {
          'content-type': 'text/plain'
        }
      })
      .post('/markdown/raw', function(err, data) {
        if (err) return cb(err);
        assert.strictEqual(String(data), '<p>foo <strong>bar</strong> #1</p>\n');
        cb();
      });
    });
  });
});
