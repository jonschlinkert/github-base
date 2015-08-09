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

describe('GitHub API', function () {
  beforeEach(function () {
    this.timeout(10000);
    github = new GitHub({
      // token: fake_user.TOKEN,
      username: fake_user.USERNAME,
      password: fake_user.PASSWORD,
    });
  });

  it('should `get` a response', function (done) {
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

  // it('should return github.gists', function (done) {
  //   this.slow(500);
  //   github.gists(function (err, res) {
  //     if (err) return done(err);

  //     assert.equal(Array.isArray(res), true);
  //     assert.deepEqual(utils.arrayKeys(res), [
  //       'url',
  //       'forks_url',
  //       'commits_url',
  //       'id',
  //       'git_pull_url',
  //       'git_push_url',
  //       'html_url',
  //       'files',
  //       'public',
  //       'created_at',
  //       'updated_at',
  //       'description',
  //       'comments',
  //       'user',
  //       'comments_url',
  //       'owner'
  //     ]);
  //     done();
  //   });
  // });

  // it('should return github.notifications', function (done) {
  //   this.slow(500);
  //   github.notifications(function (err, res) {
  //     if (err) return done(err);

  //     assert.equal(Array.isArray(res), true);
  //     assert.deepEqual(utils.arrayKeys(res), [
  //       'id',
  //       'unread',
  //       'reason',
  //       'updated_at',
  //       'last_read_at',
  //       'subject',
  //       'repository',
  //       'url',
  //       'subscription_url'
  //     ]);
  //     done();
  //   });
  // });

  // it('should return github.show', function (done) {
  //   this.slow(500);
  //   github.show('doowb', function (err, res) {
  //     if (err) return done(err);
  //     assert.equal(typeof res === 'object', true);
  //     assert.equal(res.hasOwnProperty(('login')), true);
  //     assert.equal(res.login === 'doowb', true);
  //     done();
  //   });
  // });

  // it('should return github.userRepos', function (done) {
  //   this.slow(500);
  //   github.userRepos(fake_github.USERNAME, function (err, res) {
  //     if (err) return done(err);

  //     assert.equal(Array.isArray(res), true);
  //     var keys = ['full_name', 'owner', 'html_url', 'description', 'fork'];
  //     assert.equal(utils.hasKeys(keys, res), true);
  //     done();
  //   });
  // });

  // it('should return github.userGists', function (done) {
  //   this.slow(500);
  //   github.userGists(fake_github.USERNAME, function (err, res) {
  //     if (err) return done(err);

  //     assert.equal(Array.isArray(res), true);
  //     assert.deepEqual(utils.arrayKeys(res), [
  //       'url',
  //       'forks_url',
  //       'commits_url',
  //       'id',
  //       'git_pull_url',
  //       'git_push_url',
  //       'html_url',
  //       'files',
  //       'public',
  //       'created_at',
  //       'updated_at',
  //       'description',
  //       'comments',
  //       'user',
  //       'comments_url',
  //       'owner'
  //     ]);
  //     done();
  //   });
  // });

  // it('should return github.orgRepos', function (done) {
  //   this.timeout(10000);
  //   github.orgRepos('upstage', function (err, res) {
  //     if (err) return done(err);

  //     assert.equal(Array.isArray(res), true);
  //     var keys = ['id', 'name', 'full_name', 'owner'];
  //     assert.equal(utils.hasKeys(keys, res), true);
  //     done();
  //   });
  // });

  // it('should return github.follow', function (done) {
  //   this.slow(500);
  //   github.follow('gisthub', function (err, res) {
  //     if (err) return done(err);
  //     done();
  //   });
  // });

  // it('should return github.unfollow', function (done) {
  //   this.slow(500);
  //   github.unfollow('gisthub', function (err, res) {
  //     if (err) return done(err);
  //     done();
  //   });
  // });
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
