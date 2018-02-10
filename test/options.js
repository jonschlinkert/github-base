'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('options', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub({...auth, owner: 'jonschlinkert'})));

  it('should use constructor options to resolve placeholder values in URL', function() {
    return github.get('/users/:owner/gists')
      .then(res => assert(res.body.length > 5));
  });

  it('should use instance options to resolve placeholder values in URL', function() {
    github.options.owner = 'jonschlinkert';
    return github.get('/users/:owner/gists')
      .then(res => assert(res.body.length > 5));
  });

  it('should use method options to resolve placeholder values in URL', function() {
    return github.get('/users/:owner/gists', { owner: 'doowb' })
      .then(res => assert(res.body.length > 10));
  });

  it('should merge constructor and instance options', function() {
    github.options.repo = 'github-base';

    return github.get('/repos/:owner/:repo')
      .then(res => {
        assert(res);
        assert(res.body);
        assert.strictEqual(res.body.name, 'github-base');
      });
  });

  it('should merge constructor and method options', function() {
    return github.get('/repos/:owner/:repo', { repo: 'github-base' })
      .then(res => {
        assert(res);
        assert(res.body);
        assert.strictEqual(res.body.name, 'github-base');
      });
  });
});
