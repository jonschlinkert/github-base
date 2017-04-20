'use strict';

var utils = module.exports;

/**
 * Utils
 */

utils.define = require('define-property');
utils.extend = require('extend-shallow');
utils.isBuffer = require('is-buffer');
utils.merge = require('mixin-deep');
utils.omit = require('object.omit');
utils.parseLink = require('parse-link-header');
utils.simpleGet = require('simple-get');
utils.staticExtend = require('static-extend');

/**
 * Recursive walk over paged content
 */

utils.request = function(options, cb) {
  options = options || {};
  var opts = utils.extend({}, options, {json: false});

  utils.simpleGet.concat(opts, function(err, stream, data) {
    if (err) {
      if (stream && stream.statusCode === 204) {
        cb(err, null, stream);
        return;
      }
      cb(err);
      return;
    }

    if (opts.paged === true || options.json !== false) {
      if (utils.isBuffer(data)) {
        data = data.toString();
      }

      if (typeof data === 'string' && data.trim()) {
        data = JSON.parse(data);
      }
    }
    cb(null, data, stream);
  });
};

/**
 * Recursive walk over paged content
 */

utils.paged = function(options, cb) {
  var opts = utils.extend({}, options, {paged: true});
  var arr = [];

  if (typeof opts.url !== 'string') {
    cb(new TypeError('expected options.url to be a string'));
    return;
  }

  function request(first) {
    if (first) opts.url = setPageLimit(opts.url);

    utils.request(opts, function(err, data, stream) {
      if (err) {
        cb(err);
        return;
      }

      try {
        if (data && Array.isArray(data)) {
          arr.push.apply(arr, data);
        }
        var page = utils.parseLink(stream.headers.link);
        if (page && page.next) {
          opts.url = page.next.url;
          request();
        } else {
          cb(null, arr, stream);
        }
      } catch (err) {
        cb(err);
      }
    });
  }
  request(true);
};

/**
 * Default settings to use for GitHub API requests.
 *
 * @param  {Object} `options`
 * @return {Object}
 */

utils.defaults = function(options) {
  return function(method, url, data) {
    var opts = utils.extend({method: 'get'}, options);
    opts.apiurl = opts.apiurl || 'https://api.github.com';
    var config = lowercaseKeys(opts);
    opts = utils.merge({}, config, data);
    opts = interpolate(url, opts);
    opts = createURL(opts);
    opts = lowercaseKeys(opts);
    opts = createAuth(opts);
    opts = cleanup(opts);
    opts.method = method.toLowerCase();
    opts = normalizeOpts(opts, config);

    var defaults = {
      'accept': 'application/json',
      'user-agent': 'https://github.com/jonschlinkert/github-base'
    };

    opts.headers = utils.extend({}, defaults, lowercaseKeys(opts.headers));
    return opts;
  };
};

/**
 * Replace params with actual values.
 */

function interpolate(path, options) {
  var opts = utils.extend({}, options, {params: []});
  opts.url = path.replace(/:([\w_]+)/g, function(m, prop) {
    opts.params.push(prop);
    return opts[prop] || prop;
  });
  return opts;
}

/**
 * Create url to request and prevent cache
 */

function createURL(opts) {
  opts.url += setPrefix(opts.url);
  opts.url += (new Date()).getTime();
  opts.url = opts.apiurl + opts.url;
  return opts;
}

/**
 * Lowercase the keys in the given object.
 */

function lowercaseKeys(obj) {
  var res = {};
  for (var key in obj) res[key.toLowerCase()] = obj[key];
  return res;
}

/**
 * Create auth string - token, Bearer or Basic Auth
 */

function createAuth(options) {
  var opts = utils.merge({headers: {}}, options);
  if (!opts.bearer && !opts.token && !opts.username && !opts.password) {
    return opts;
  }

  if (opts.token) {
    opts.headers['authorization'] = 'token ' + opts.token;
    return opts;
  }

  if (opts.bearer) {
    opts.headers['authorization'] = 'Bearer ' + opts.bearer;
    return opts;
  }

  var creds = opts.username + ':' + opts.password;
  opts.headers['authorization'] = 'Basic ' + toBase64(creds);
  return opts;
}

/**
 * Cleanup request options object
 */

function cleanup(options) {
  var opts = utils.extend({}, options);
  var keys = ['apiurl', 'token', 'username', 'password', 'placeholders'];
  if (Array.isArray(opts.params) && opts.params.length) {
    keys = keys.concat(opts.params);
  }
  return utils.omit(opts, keys);
}

/**
 * Normalize request options object,
 * the request body and few body-related headers
 */

function normalizeOpts(options, config) {
  var opts = utils.extend({}, options);
  var json = opts.json;
  var keys = Object.keys(config).concat(['headers', 'method', 'url', 'params']);
  var body = utils.omit(opts, keys);
  var text;

  if (/markdown\/raw/.test(opts.url)) {
    text = opts.body;
  }

  var bodyKeys = Object.keys(body);
  if (bodyKeys.length) {
    opts = utils.omit(opts, bodyKeys);
    var bodyString = JSON.stringify(body);
    opts.body = body;
    opts.headers['content-length'] = bodyString.length;

    if (!isString(opts.headers['content-type'])) {
      opts.headers['content-type'] = 'application/json';
    }
  } else if (String(opts.method).toLowerCase() === 'put') {
    opts.headers['content-length'] = 0;
  }

  if (text) {
    opts.body = text;
  } else if (opts.json !== true) {
    opts.body = JSON.stringify(opts.body);
  }

  opts.json = json;
  return opts;
}

function isString(str) {
  return str && typeof str === 'string';
}

function setPageLimit(str) {
  var url = str.replace(/[?&]per_page=\d+/, '');
  return url + setPrefix(url) + 'per_page=100';
}

function setPrefix(url) {
  return /\?/.test(url) ? '&' : '?';
}

/**
 * Convert a string to base64
 */

function toBase64(str) {
  return new Buffer(str).toString('base64');
}
