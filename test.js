/*!
 * github-base <https://github.com/jonschlinkert/github-base>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps:mocha */
var should = require('should');
var base = require('./');

describe('base', function () {
  it('should return an error message when the url is not found:', function (cb) {
    base('foo', function (err, res) {
      if (err) console.log(err);
      res.should.be.an.object;
      res.message.should.equal('Not Found');
      cb()
    });
  });

  it('should get a response from the github api:', function (cb) {
    base('repos/assemble/assemble/contributors', function (err, res) {
      if (err) console.log(err);
      res.should.be.an.array;
      res[0].should.have.properties(['login', 'id', 'avatar_url', 'gravatar_id']);
      cb();
    });
  });

  it('should work by passing different endpoint', function(cb) {
    var opts = {
      endpoint: 'https://api.github.com/repos/'
    };
    base('assemble/assemble/contributors', opts, function (err, res) {
      if (err) console.log(err);
      res.should.be.an.array;
      res[0].should.have.properties(['login', 'id', 'avatar_url', 'gravatar_id']);
      cb();
    });
  });

  it('should throw an error when url is not a string:', function () {
    (function () {
      base();
    }).should.throw('github-base expects url to be a string.');
  });

  it('should throw an error when no callback is given.', function () {
    (function () {
      base('foo');
    }).should.throw('github-base expects callback to be a function.');

    (function () {
      base('foo', {});
    }).should.throw('github-base expects callback to be a function.');
  });
});
