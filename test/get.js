'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.get', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('authentication', function() {
    it('should default to `bad credentials` when they are needed', function() {
      github = new GitHub({ username: 'bad', password: 'credentials' });

      const expected = {
        message: 'Bad credentials',
        documentation_url: 'https://developer.github.com/v3'
      };

      return github.get(`/repos/${auth.username}/fooobarbaz`)
        .then(res => assert(!res))
        .catch(err => assert.deepEqual(err.res.body, expected));
    });

    it('should get resources when unauthenticated', function() {
      github = new GitHub({ repo: 'jonschlinkert/github-base' });

      return github.get('/repos/:repo/contributors')
        .then(res => assert.strictEqual(res.body.length > 0, true));
    });
  });

  describe('options', function() {
    it('should use constructor options to resolve placeholder values in URL', function() {
      github = new GitHub({ ...auth, owner: 'jonschlinkert' });
      return github.get('/users/:owner/gists')
        .then(res => assert(res.body.length > 5));
    });

    it('should use instance options to resolve placeholder values in URL', function() {
      github.options.owner = 'jonschlinkert';
      return github.get('/users/:owner/gists')
        .then(res => assert(res.body.length > 5));
    });

    it('should use method options to resolve placeholder values in URL', function() {
      return github.get('/users/:owner/gists', { owner: auth.username })
        .then(res => assert(res.body.length > 10));
    });

    it('should merge constructor and method options', function() {
      return github.get('/repos/:owner/:repo', { owner: 'jonschlinkert', repo: 'github-base' })
        .then(res => {
          assert(res);
          assert(res.body);
          assert.strictEqual(res.body.name, 'github-base');
        });
    });
  });
});
