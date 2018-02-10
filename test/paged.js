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
      return github.paged('/users/:owner/gists', { owner: 'doowb' })
        .then(res => {
          assert(res.pages[0].body.length > 30);

          res.pages.forEach(function(page) {
            assert(Array.isArray(page.body));
            assert(typeof page.body[0].url, 'string');
          });
        });
    });

    it('should set the per_page limit using a query string', function() {
      return github.paged('/users/:owner/gists?per_page=30', { owner: 'doowb' })
        .then(res => {
          assert.equal(res.pages[0].body.length, 30);

          res.pages.forEach(function(page) {
            assert(Array.isArray(page.body));
            assert(typeof page.body[0].url, 'string');
          });
        });
    });

    it('should set the per_page limit using options', function() {
      return github.paged('/users/:owner/gists', { owner: 'doowb', query: { per_page: 30 } })
        .then(res => {
          assert.equal(res.pages[0].body.length, 30);

          res.pages.forEach(function(page) {
            assert(Array.isArray(page.body));
            assert(typeof page.body[0].url, 'string');
          });
        });
    });
  });
});
