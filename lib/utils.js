'use strict';

var extend = require('extend-shallow');
var merge = require('merge-deep');
var omit = require('object.omit');

/**
 * Default settings to use for GitHub API requests.
 *
 * @param  {Object} `opts`
 * @return {Object}
 */

module.exports = function defaults(opts) {
  return function defaults(method, path, data) {
    var config = lowercase(opts);
    opts = merge({}, config, data);
    opts = interpolate(path, opts);
    opts = createURL(opts);
    opts = lowercase(opts);
    opts = createAuth(opts);
    opts = cleanup(opts);
    opts.method = opts.method || method || 'get';
    opts = normalize(opts, config);

    opts.headers = extend({
      accept: 'application/json',
      'user-agent': 'https://github.com/jonschlinkert/github-base'
    }, lowercase(opts.headers));

    return opts;
  };
};

/**
 * Replace placeholders with actual values.
 */

function interpolate(path, opts) {
  var placeholders = [];
  opts = opts || {};

  opts.url = path.replace(/:(\w+)/g, function(m, prop) {
    placeholders.push(prop);
    return opts[prop] || prop;
  });
  opts.placeholders = placeholders;

  return opts;
}

/**
 * Create url to request and prevent cache
 */

function createURL(opts) {
  opts.url += (/\?/.test(opts.url) ? '&' : '?');
  opts.url += (new Date()).getTime();
  opts.url = opts.apiurl + opts.url;
  return opts;
}

/**
 * Lowercase the keys in the given object.
 */

function lowercase(obj) {
  var res = {};
  for (var key in obj) {
    res[key.toLowerCase()] = obj[key];
  }
  return res;
}

/**
 * Create auth string - token or Basic Auth
 */

function createAuth(opts) {
  opts.headers = opts.headers || {};
  if (opts.token) {
    opts.headers['authorization'] = 'token ' + opts.token;
    return opts;
  }

  var creds = opts.username + ':' + opts.password;
  opts.headers['authorization'] = 'Basic ' + toBase64(creds);

  return opts;
}

/**
 * Cleanup request options object
 */

function cleanup(opts) {
  var keys = [
    'apiurl', 'token', 'username', 'password', 'placeholders'
  ];
  opts.placeholders = opts.placeholders.concat(keys);
  opts = omit(opts, opts.placeholders);

  return opts;
}

/**
 * Normalize request options object,
 * the request body and few body-related headers
 */

function normalize(opts, config) {
  var body = omit(opts, Object.keys(config).concat([
    'headers', 'method', 'url'
  ]));
  var bodyKeys = Object.keys(body);
  var isBody = bodyKeys.length !== 0;

  if (isBody) {
    opts = omit(opts, bodyKeys);
    opts.body = JSON.stringify(body);
    opts.headers['content-length'] = opts.body.length;
  }
  if (isBody && !opts.headers['content-type']) {
    opts.headers['content-type'] = 'application/json';
  }
  if (!isBody && opts.method.toLowerCase() === 'put') {
    opts.headers['content-length'] = 0;
  }

  return opts;
}

/**
 * Convert a string to base64
 */

function toBase64(str) {
  return new Buffer(str).toString('base64');
}
