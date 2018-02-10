'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.patch', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  it('should PATCH an issue', function() {
    return github.patch('/repos/:owner/:repo/issues/:number', {
      owner: 'jonschlinkert',
      repo: 'github-base',
      number: 14,
      title: 'issue-api-test',
      body: 'this is a test',
      assignees: ['jonschlinkert'],
      state: 'closed'
    })
      .then(function(res) {
        assert.strictEqual(res.body.number, 14);
        assert.strictEqual(res.body.title, 'issue-api-test');
      });
  });
});
