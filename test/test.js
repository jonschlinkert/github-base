'use strict';

/* deps: mocha */
var assert = require('assert');
var should = require('should');
var utils = require('./support');
var GitHub = require('..');
var github;

var fake_user = {
  TOKEN: 'fa9b3d7cb70c378779443e601bdf6c4bc59c79ad',
  USERNAME: 'fake-user123',
  PASSWORD: 'fakeuser123'
};

describe('static methods', function () {
  it('should inherit GitHub with `.extend`', function () {
    function Foo() {
      GitHub.call(this);
    }
    GitHub.extend(Foo);
    Foo.prototype.should.have.property('get');
    Foo.prototype.should.have.property('put');
  });

  it('should add prototype methods with delegate:', function () {
    function Foo() {
      GitHub.call(this);
    }
    GitHub.extend(Foo);
    GitHub.delegate({
      bar: function () {}
    });
    Foo.delegate({
      baz: function () {}
    });
    Foo.prototype.should.have.property('bar');
    Foo.prototype.should.have.property('baz');
  });
});

describe('GitHub API', function () {
  beforeEach(function () {
    this.timeout(10000);
    github = new GitHub({
      // token: fake_user.TOKEN,
      username: fake_user.USERNAME,
      password: fake_user.PASSWORD,
    });
  });

  describe('GET', function () {
    it('should get user orgs:', function (done) {
      this.slow(500);

      github.get('/user/orgs', function (err, res) {
        if (err) return done(err);

        assert.equal(Array.isArray(res), true);
        assert.deepEqual(utils.arrayKeys(res), [
          'login',
          'id',
          'url',
          'repos_url',
          'events_url',
          'members_url',
          'public_members_url',
          'avatar_url',
          'description'
        ]);
        done();
      });
    });
  });

  describe('PUT', function () {
    it('should follow a user with `PUT` request', function (done) {
      this.slow(500);

      github.request('PUT', '/user/following/jonschlinkert', function(err, res) {
        if (err) return done(err);
        assert.equal(err === null, true);
        assert.equal(typeof res === 'string', true);
        assert.equal(res, '');
        done();
      });
    });

    it('should follow a user with `put` method', function (done) {
      this.slow(500);

      github.put('/user/following/jonschlinkert', function(err, res) {
        if (err) return done(err);
        assert.equal(err === null, true);
        assert.equal(typeof res === 'string', true);
        assert.equal(res, '');
        done();
      });
    });
  });

  describe('DELETE', function () {
    it('should un-follow a user with `DELETE` request', function (done) {
      this.slow(500);

      github.request('DELETE', '/user/following/gisthub', function(err, res) {
        if (err) return done(err);
        assert.equal(err === null, true);
        assert.equal(typeof res === 'string', true);
        assert.equal(res, '');
        done();
      });
    });

    it('should un-follow a user with `del` method', function (done) {
      this.slow(500);

      github.del('/user/following/gisthub', function(err, res) {
        if (err) return done(err);
        assert.equal(err === null, true);
        assert.equal(typeof res === 'string', true);
        assert.equal(res, '');
        done();
      });
    });
  });
});
