'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('authentication', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  it('should throw an error when bad credentials are provided', function() {
    github = new GitHub({ username: 'bad', password: 'credentials' });

    return github.get('/repos/doowb/fooobarbaz')
      .then(res => assert(!res))
      .catch(err => {
        assert.deepEqual(err.message, 'Bad credentials');
      });
  });

  it('should authenticate with username and password', function() {
    return github.get('/gists').then(res => assert(res.body.length > 0));
  });
});
