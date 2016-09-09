'use strict';

require('mocha');
var assert = require('assert');
var auth = require('./support/auth');
var GitHub = require('..');
var github;

describe('.patch', function() {
  beforeEach(function() {
    github = new GitHub(auth);
  });

  it('should edit an issue', function(cb) {
    this.timeout(5000);

    github.patch('/repos/:owner/:repo/issues/:number', {
      owner: 'jonschlinkert',
      repo: 'github-base',
      number: 14,
      title: 'issue-api-test',
      body: 'this is a test'
    }, function(err, data, stream) {
      if (err) return cb(err);
      assert.strictEqual(data.number, 14);
      assert.strictEqual(data.title, 'issue-api-test');
      cb();
    });
  });
});
