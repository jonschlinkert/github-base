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

  params = typeof params === 'object' ? params : {};

  var env = process.env;
  var id = params.id;
  var secret = params.secret;
  var token = env.GITHUB_TOKEN || params.token;
  var endpoint = env.GITHUB_ENDPOINT || params.endpoint;
  var url = params.url || address(endpoint, url);

  params.headers = {
    'accept': 'application/vnd.github.v3+json',
    'user-agent': 'https://github.com/jonschlinkert/github-base'
  };

  if (token) {
    params.headers['authorization'] = 'token ' + token;
  }

  if (id && secret) {
    url = url + ('?client_id=' + id + '&client_secret=' + secret);
  }

  params.url = url;

  request(params, function (err, res, body) {
    if (err) return cb(err);
    cb(null, JSON.parse(body));
  });
};

function address(endpoint, url) {
  endpoint = endpoint || 'https://api.github.com/';
  return endpoint + url;
}
