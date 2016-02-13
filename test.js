'use strict';

/* deps: mocha */
var assert = require('assert');
var Github = require('./index');

var creds = {
  username: 'fake-user123',
  password: 'fakeuser123'
};

describe('static methods', function() {
  it('should inherit Github with `.extend`', function(cb) {
    function Foo () {
      Github.call(this);
    }
    Github.extend(Foo);

    assert.strictEqual(typeof Foo.prototype.get, 'function');
    assert.strictEqual(typeof Foo.prototype.put, 'function');
    cb();
  });
  it('should add prototype methods with delegate:', function(cb) {
    function Foo () {
      Github.call(this);
    }
    Github.extend(Foo);

    Github.delegate({
      bar: function() {}
    });
    Foo.delegate({
      baz: function() {}
    });

    assert.strictEqual(typeof Foo.prototype.bar, 'function');
    assert.strictEqual(typeof Foo.prototype.baz, 'function');
    cb();
  });
});

describe('Github API', function() {
  describe('POST /markdown and /markdown/raw', function() {
    it('should work with `/markdown` endpoint', function(cb) {
      this.timeout(5000);

      Github(creds).post('/markdown', {
        json: false,
        text: 'foo **bar** @tunnckoCore baz!',
        mode: 'gfm',
        headers: {
          'content-type': 'application/json'
        }
      }, function(err, data, stream) {
        assert.ifError(err);
        assert.ok(data.indexOf('https://github.com/tunnckoCore') !== -1);
        assert.strictEqual(stream.statusCode, 200);
        cb();
      });
    });

    it('should pass raw body to `/markdown/raw`', function(cb) {
      this.timeout(5000);

      Github({
        json: false,
        username: creds.username,
        password: creds.password,
        body: 'foo **bar** #1',
        headers: {
          'content-type': 'text/plain'
        }
      })
      .post('/markdown/raw', function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data, '<p>foo <strong>bar</strong> #1</p>\n');
        cb();
      });
    });
  });

  describe('GET', function() {
    it('should concatenate all additional content with `.getAll`', function(cb) {
      this.timeout(60000);

      var github = new Github(creds);
      github.getAll('/users/:jon/repos', {jon: 'jonschlinkert'}, function(err, data) {
        assert.ifError(err);
        assert.ok(data.length >= 500, 'expect `jonschlinkert` to have more than 500 repos');
        cb();
      });
    });

    it('should default to `bad credentials` when they are needed', function(cb) {
      this.timeout(5000);

      Github({username: 'bad', password: 'credentials'})
        .get('/repos/tunnckoCore/dush', function(err, actual) {
          assert.ifError(err);
          var expected = {
            message: 'Bad credentials',
            documentation_url: 'https://developer.github.com/v3'
          };

          assert.deepEqual(actual, expected);
          cb();
        });
    });
    it.skip('should auth with token', function(cb) {
      this.timeout(5000);

      Github(creds).post('/authorizations', {
        note: 'foo-bar baz auth qux'
      }, function(err, tok) {
        assert.ifError(err);

        Github({token: tok.token}).get('/gists', function(err, data) {
          assert.ifError(err);
          assert.strictEqual(data.length > 0, true);
          Github(creds).del('/authorizations/:id', {id: tok.id}, cb);
        });
      });
    });

    it('should get resources when unauthenticated', function(cb) {
      this.timeout(5000);

      var github = new Github();

      github.get('/repos/:repo/contributors', {repo: 'jonschlinkert/github-base'}, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.length > 0, true);
        cb();
      });
    });

    it('should auth with username and password', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password
      });

      github.get('/gists', function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.length > 0, true);
        cb();
      });
    });

    it('should pass placeholders for `path` in `data`', function(cb) {
      this.timeout(5000);

      var github = new Github(creds);
      github.get('/users/:owner/gists', {
        owner: 'tunnckoCore'
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.length > 10, true);
        cb();
      });
    });

    it('should pass placeholders for `path` in constructor options', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password,
        owner: 'jonschlinkert'
      });

      github.get('/users/:owner/gists', function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.length > 5, true);
        cb();
      });
    });

    it('should merge `options` and `data`', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password,
        owner: 'jonschlinkert'
      });

      github.get('/repos/:owner/:repo', {
        owner: 'tunnckoCore',
        repo: 'dush'
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(typeof data, 'object');
        assert.strictEqual(data.name, 'dush');
        cb();
      });
    });

    it('should `GET` single gist with `.request` method', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password
      });

      github.request('get', '/gists/:id', {
        id: 'aafbcdecb7bad02a2df1'
      }, function(err, data, stream) {
        assert.ifError(err);
        assert.strictEqual(data.id, 'aafbcdecb7bad02a2df1');
        assert.strictEqual(data.url, 'https://api.github.com/gists/aafbcdecb7bad02a2df1');
        assert.strictEqual(stream.statusCode, 200);
        cb();
      });
    });
  });

  describe('PUT', function() {
    it('should subscribe to repository with `.put` method', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password,
        owner: 'jonschlinkert'
      });

      github.put('/repos/:owner/:repo/subscription', {
        repo: 'github-base',
        subscribed: true
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.subscribed, true);
        assert.strictEqual(data.ignored, false);
        cb();
      });
    });

    it('should unsubscribe from repo with `PUT` .request', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password,
        owner: 'jonschlinkert'
      });

      github.request('PUT', '/repos/:owner/:repo/subscription', {
        repo: 'github-base',
        subscribed: false,
        ignored: true
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.subscribed, false);
        assert.strictEqual(data.ignored, true);
        cb();
      });
    });

    it('should set content-length to zero (star a gist, status 204)', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password
      });

      github.put('/gists/:id/star', {
        id: '32a6fe359168ecc6f76a'
      }, function(err, data, stream) {
        assert.ifError(err);
        assert.strictEqual(typeof data, 'string');
        assert.strictEqual(data, '');
        assert.strictEqual(stream.statusCode, 204);
        cb();
      });
    });

    it('should be able to change method from `data` object', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password
      });

      github.put('/users/:owner/followers', {
        owner: 'tunnckoCore',
        method: 'get'
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(Array.isArray(data), true);
        assert.strictEqual(data.length > 1, true);
        cb();
      });
    });
  });

  describe('PATCH', function() {
    it('should change gist description with `PATCH` .request', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password,
        id: 'aafbcdecb7bad02a2df1'
      });

      github.request('PATCH', '/gists/:id', {
        description: 'gist update test ' + Math.random()
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.id, 'aafbcdecb7bad02a2df1');
        assert.strictEqual(data.url, 'https://api.github.com/gists/aafbcdecb7bad02a2df1');
        cb();
      });
    });
    it.skip('should edit an issue with `.patch` method', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password,
        owner: 'fake-user123'
      });

      github.patch('/repos/:owner/:repo/issues/:number', {
        repo: 'fake-repo',
        number: 3,
        title: 'github-base test',
        body: 'issue body from `github-base` by @tunnckoCore'
      }, function(err, data) {
        assert.ifError(err);
        assert.strictEqual(data.number, 3);
        assert.strictEqual(data.title, 'github-base test');
        cb();
      });
    });
  });

  describe('DELETE', function() {
    it('should un-follow a user with `DELETE` request', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password
      });

      github.request('DELETE', '/user/following/gisthub', function(err, data, stream) {
        assert.ifError(err);
        assert.strictEqual(typeof data, 'string');
        assert.strictEqual(data, '');
        assert.strictEqual(stream.statusCode, 204);
        cb();
      });
    });

    it('should un-follow a user with `.del` method', function(cb) {
      this.timeout(5000);

      var github = new Github({
        username: creds.username,
        password: creds.password
      });

      github.del('/user/following/gisthub', function(err, data, stream) {
        assert.ifError(err);
        assert.strictEqual(typeof data, 'string');
        assert.strictEqual(data, '');
        assert.strictEqual(stream.statusCode, 204);
        cb();
      });
    });
  });
});
