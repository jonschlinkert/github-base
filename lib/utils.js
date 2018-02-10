'use strict';

const clone = require('clone-deep');
const get = require('get-value');
const has = require('has-value');
const needle = require('needle');
const omit = require('object.omit');
const paged = require('paged-request');
const parseLink = require('parse-link-header');
const union = require('arr-union');
const defaultHeaders = {
  accept: 'application/json',
  'user-agent': 'https://github.com/jonschlinkert/github-base'
};

/**
 * Utils
 */

exports.request = function(method, path, options, cb) {
  const defaults = exports.defaults({});
  const opts = Object.assign({}, defaults(method, path, options));
  let data = /^(put|patch|post)$/i.test(opts.method) ? options : null;
  if (data) data = JSON.stringify(sanitize(data, opts.params));

  const promise = needle(opts.method, opts.url, data, opts)
    .then(res => result(res, data, opts, options));

  if (typeof cb === 'function') {
    promise.then(res => cb(null, res)).catch(cb);
    return;
  }

  return promise;
};

/**
 * Recursive walk over paged content
 */

exports.paged = function(method, path, options, callback) {
  const defaults = exports.defaults({});
  const opts = Object.assign({}, defaults(method, path, options));

  function nextPage(url, res, acc) {
    let page;
    if (res.headers.link && (page = parseLink(res.headers.link))) {
      return page.next ? page.next.url : null;
    }
  }

  const promise = paged(opts.url, opts, nextPage)
    .then(res => result(res, options, opts, options));

  if (typeof callback === 'function') {
    return promise.then(res => callback(null, res)).catch(callback);
  }

  return promise;
};

/**
 * Normalize request options object, request body, headers and related properties
 * to use for GitHub API requests.
 *
 * @param  {Object} `appOptions` Options on the instance of github-base.
 * @return {Function} Returns a function that takes a request method name, the URL to expand, and method options.
 */

exports.defaults = function(appOptions) {
  const defaults = { apiurl: 'https://api.github.com', method: 'get', params: [] };

  return function(method, url, methodOptions) {
    const options = Object.assign({}, defaults, appOptions, methodOptions, { url, method });
    const context = { orig: clone(options), options: lowercaseKeys(options) };
    context.options.url = interpolate(url, context);
    context.options.headers = createHeaders(context.options);

    let opts = context.options;
    const body = omit(context.orig, Object.keys(opts));
    const json = opts.json;
    const text = opts.body;

    if (!opts.mode && /\/markdown(?!\/raw)/.test(opts.url)) {
      opts.mode = 'gfm';
    }

    const bodyKeys = Object.keys(body);
    if (bodyKeys.length > 0) {
      opts = omit(opts, bodyKeys);
      opts.headers['content-length'] = JSON.stringify(body).length;

      if (typeof opts.headers['content-type'] !== 'string') {
        opts.headers['content-type'] = 'application/json';
      }
    } else if (lowercase(opts.method) === 'put') {
      opts.headers['content-length'] = 0;
    }

    if (text) {
      opts.body = text;
    } else if (opts.body && opts.json !== true) {
      opts.body = JSON.stringify(opts.body);
    }

    if (typeof json === 'boolean') {
      opts.json = json;
    }

    opts = sanitize(opts, opts.params);
    return opts;
  };
};

/**
 * Create auth string - token, Bearer or Basic Auth
 */

function createHeaders(options) {
  const opts = Object.assign({}, options);
  const headers = Object.assign({}, defaultHeaders, opts.headers);

  if (!opts.bearer && !opts.token && !opts.username && !opts.password) {
    return headers;
  }

  if (opts.token) {
    headers['authorization'] = 'token ' + opts.token;
    return headers;
  }

  if (opts.bearer) {
    headers['authorization'] = 'Bearer ' + opts.bearer;
    return headers;
  }

  const creds = opts.username + ':' + opts.password;
  headers['authorization'] = 'Basic ' + toBase64(creds);
  return headers;
}

/**
 * Create request URL by replacing params with actual values.
 */

function interpolate(url, context) {
  let val = context.options.apiurl + url.replace(/:([\w_]+)/g, function(m, key) {
    union(context.options.params, key);
    return has(context.options, key) ? get(context.options, key) : key;
  });
  val += /\?/.test(url) ? '&' : '?';
  val += (new Date()).getTime();
  return val;
}

function result(res, data, opts, options) {
  if (res.statusCode >= 400) {
    const err = new Error(res.body.message);
    err.res = res;
    return Promise.reject(err);
  }

  if (!res.url) res.url = opts.url;
  if (res.op) res.id = options.id;

  if (/\/markdown\/raw/.test(res.url) && opts.headers['content-type'] === 'text/plain') {
    try {
      const parsed = JSON.parse(res.body.trim().replace(/^<p>|<\/p>$/g, ''));
      res.body = `<p>${parsed.body}</p>\n`;
    } catch (err) {
      /* do nothing */
    }
  }

  return Object.assign({}, data, res);
}

/**
 * Cleanup request options object
 */

function sanitize(options, blacklist) {
  const opts = Object.assign({}, options);
  const defaults = ['apiurl', 'token', 'username', 'password', 'placeholders', 'bearer'];
  const keys = union([], defaults, blacklist);
  return omit(opts, keys);
}

function lowercaseKeys(obj) {
  const acc = {};
  for (const key of Object.keys(obj)) acc[lowercase(key)] = obj[key];
  return acc;
}

function lowercase(str) {
  return typeof str === 'string' ? str.toLowerCase() : '';
}

/**
 * Convert a string to base64
 */

function toBase64(str) {
  return new Buffer(str).toString('base64');
}
