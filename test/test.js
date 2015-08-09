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
    it('should follow a user', function (done) {
      this.slow(500);

      github.put('/user/following/jonschlinkert', function(err, res) {
        if (err) return done(err);

        console.log(arguments)
        // assert.equal(Array.isArray(res), true);
        done();
      });
    });
  });
});


// describe('base', function () {
//   it('should return an error message when the url is not found:', function (cb) {
//     base('foo', function (err, res) {
//       if (err) console.log(err);
//       res.should.be.an.object;
//       res.message.should.equal('Not Found');
//       cb()
//     });
//   });
//   it('should get a response from the github api:', function (cb) {
//     base('repos/assemble/assemble/contributors', function (err, res) {
//       if (err) console.log(err);
//       res.should.be.an.array;
//       res[0].should.have.properties(['login', 'id', 'avatar_url', 'gravatar_id']);
//       cb();
//     });
//   });

//   it('should throw an error when url is not a string:', function () {
//     (function () {
//       base();
//     }).should.throw('github-api-base expects url to be a string.');
//   });

//   it('should throw an error when no callback is given.', function () {
//     (function () {
//       base('foo');
//     }).should.throw('github-api-base expects callback to be a function.');

//     (function () {
//       base('foo', {});
//     }).should.throw('github-api-base expects callback to be a function.');
//   });
// });
