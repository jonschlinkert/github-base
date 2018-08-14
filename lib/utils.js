'use strict';

const qs = require('qs');
const url = require('url');
const get = require('get-value');
const needle = require('needle');
const paged = require('paged-request');
const parseLink = require('parse-link-header');
const defaultHeaders = {
  accept: 'application/json',
  'user-agent': 'https://github.com/jonschlinkert/github-base'
};

/**
 * Utils
 */

exports.request = function(method, path, options) {
  const defaults = exports.defaults({});
  const opts = Object.assign({}, defaults(method, path, options));
  let data = /^(put|patch|post)$/i.test(opts.method) ? options : null;
  if (data) data = JSON.stringify(sanitize(data, opts.params));

  return needle(opts.method, opts.url, data, opts)
    .then(res => result(res, data, opts, options));
};

/**
 * Recursive walk over paged content
 */

exports.paged = function(method, path, options) {
  const defaults = exports.defaults({});
  const opts = Object.assign({}, defaults(method, path, options));

  function nextPage(_url, res, acc) {
    if (typeof opts.next === 'function') {
      opts.next(_url, sanitize(res), sanitize(acc));
    }

    let page;
    if (res.headers.link && (page = parseLink(res.headers.link))) {
      return page.next ? page.next.url : null;
    }
  }

  return paged(opts.url, opts, nextPage)
    .then(res => result(res, options, opts, options))
    .then(res => sanitize(res));
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

  return function(method, uri, methodOptions) {
    const options = Object.assign({}, defaults, appOptions, methodOptions, { uri, method });
    const context = { orig: Object.assign({}, options), options: lowercaseKeys(options) };
    context.options.url = interpolate(uri, context);
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

    if (typeof json === 'boolean') {
      opts.json = json;
    }

    if (text) {
      opts.body = opts.json !== true ? JSON.stringify(text) : text;
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

function interpolate(str, context) {
  const opts = { ...context.options };

  let val = opts.apiurl + str.replace(/:([\w_]+)/g, (m, key) => {
    opts.params = union(opts.params, key);
    let val = get(opts, key);
    if (val !== void 0) {
      return val;
    }
    return key;
  });

  if (opts.method.toLowerCase() === 'get' && opts.paged !== false) {
    const obj = url.parse(val);
    const query = obj.query ? qs.parse(obj.query) : {};
    const noquery = omit(obj, ['query', 'search']);
    noquery.query = noquery.search = qs.stringify(Object.assign({ per_page: 100 }, opts.query, query));
    val = url.format(noquery);
  }

  val += /\?/.test(val) ? '&' : '?';
  val += (new Date()).getTime();
  return val;
}

function result(res, data, opts, options) {
  if (res.statusCode >= 400) {
    const err = new Error(res.body.message);
    Reflect.defineProperty(err, 'res', { value: res, enumerable: false });
    return Promise.reject(err);
  }

  if (!res.url) res.url = opts.url;
  if (res.op) res.id = options.id;

  if (/\/markdown\/raw/.test(res.url) && opts.headers['content-type'] === 'text/plain') {
    try {
      const parsed = JSON.parse(res.body.trim().replace(/^<p>|<\/p>$/g, ''));
      res.body = `<p>${parsed.body}</p>\n`;
    } catch (err) { /* do nothing */ }
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

function omit(obj, keys) {
  keys = [].concat(keys || []);
  let res = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      res[key] = obj[key];
    }
  }
  return res;
}

function union(...args) {
  const arr = new Set();
  for (const arg of args) {
    for (const ele of [].concat(arg)) {
      if (ele) arr.add(ele);
    }
  }
  return [...arr];
}

/**
 * Convert a string to base64
 */

function toBase64(str) {
  return Buffer.from(str).toString('base64');
}
