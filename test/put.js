'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.put', function() {
  this.timeout(5000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('promise', function() {
    it('should subscribe to repository', function() {
      let owner = 'jonschlinkert';
      let repo = 'github-base';

      return github.put(`/repos/${owner}/${repo}/subscription`, { subscribed: true })
        .then(function(res) {
          assert(res.body.subscribed);
          assert(!res.body.ignored);
        });
    });

    it('should set content-length to zero (star a gist, status 204)', function() {
      let id = '32a6fe359168ecc6f76a';
      return github.put(`/gists/${id}/star`)
        .then(res => {
          assert.strictEqual(res.raw.toString(), '');
          assert.strictEqual(res.body.toString(), '');
          assert.strictEqual(res.statusCode, 204);
        });
    });
  });
});
