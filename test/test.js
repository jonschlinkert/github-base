'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('API', function() {
  it('should inherit GitHub with `.extend`', function(cb) {
    function Foo () {
      GitHub.call(this);
    }

    GitHub.extend(Foo);
    assert.strictEqual(typeof Foo.prototype.get, 'function');
    assert.strictEqual(typeof Foo.prototype.put, 'function');
    cb();
  });

  it('should support plugins', function(cb) {
    var github = new GitHub();
    var count = 0;

    github.a = 'b';
    github.use(function() {
      count++;
      assert(this.a, 'b');
    });

    assert.equal(count, 1);
    cb();
  });
});
