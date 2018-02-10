'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.paged', function() {
  this.timeout(20000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('.paged /users/:user/gists', function() {
    it('should get all gists for the given user', function() {
      return github.paged('/users/:user/gists', { user: 'doowb' })
        .then(res => {
          assert(res.pages.length > 1);

          res.pages.forEach(function(page) {
            assert(Array.isArray(page.body));
            assert(typeof page.body[0].url, 'string');
          });
        });
    });
  });
});
