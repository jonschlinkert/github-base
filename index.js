/*!
 * github-base <https://github.com/jonschlinkert/github-base>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var request = require('request');

module.exports = function base(url, params, cb) {
  if (typeof url !== 'string') {
    throw new TypeError('github-api-base expects url to be a string.');
  }

  if (typeof params === 'function') {
    cb = params; params = {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError('github-api-base expects callback to be a function.');
  }

  params = params || {};
  var id = params.id;
  var secret = params.secret;
  params.headers = {'user-agent': 'node.js'};
  params.url = params.url || (address(url) + auth(id, secret));

  request(params, function (err, res, body) {
    if (err) return cb(err);
    cb(null, JSON.parse(body));
  });
};

function auth(id, secret) {
  return id && secret ? ('?client_id=' + id + '&client_secret=' + secret) : '';
}

function address(url) {
  return 'https://api.github.com/' + url;
}
