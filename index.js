'use strict';

var util = require('util');
var utils = require('./lib/utils');
var request = require('simple-get');
var concat = require('concat-stream');
var extend = require('extend-shallow');
var delegate = require('delegate-properties');

/**
 * Create an instance of `GitHub` with the given options.
 *
 * ```js
 * var GitHub = require('github-base');
 * var github = new GitHub(options);
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

function GitHub(options) {
  if (!(this instanceof GitHub)) {
    return new GitHub(options);
  }

  this.options = typeof options === 'object' ? options : {};
  this.options.json = typeof this.options.json === 'boolean' ? this.options.json : true;
  this.options.apiurl = this.options.apiurl || 'https://api.github.com';
  this.defaults = utils.defaults(this.options);
}

/**
 * GitHub prototype methods
 */

delegate(GitHub.prototype, {
  constructor: GitHub,

  /**
   * Uses [simple-get][] to make a single request to the
   * GitHub API, based on the provided settings. Supports any
   * of the GitHub API VERBs:
   *
   *   - `GET`, `PUT`, `POST`, `DELETE`, `PATCH`
   *
   * @name .request
   * @param  {String} `method`
   * @param  {String} `url` GitHub API URL to use.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  request: function(method, path, data, cb) {
    if (typeof data === 'function') {
      cb = data;
      data = null;
    }

    cb = typeof cb === 'function' ? cb : function noop () {};
    var opts = this.defaults(method, path, data);

    request(opts, function (err, res) {
      if (err) {return cb(err);}
      res.pipe(concat(function (data) {
        data = data.toString();
        if (data && data.length && opts.json === true) {
          data = JSON.parse(data);
        }
        cb(null, data, res);
      }));
    });
    return this;
  },

  /**
   * Makes a single `GET` request to the GitHub API based on the
   * provided settings.
   *
   * @name .get
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  get: function(path, data, cb) {
    this.request('GET', path, data, cb);
    return this;
  },

  /**
   * Performs a request using [simple-get][], and then if necessary
   * requests additional paged content based on the response. Data from
   * all pages are concatenated together and buffered until the last
   * page of data has been retrieved.
   *
   * @name .getAll
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Function} `cb`
   * @api public
   */

  getAll: function(path, data, cb) {
    if (typeof data === 'function') {
      cb = data;
      data = null;
    }

    cb = typeof cb === 'function' ? cb : function noop () {};
    var opts = this.defaults('GET', path, data);

    utils.requestAll(opts, cb);
    return this;
  },

  /**
   * Makes a single `DELETE` request to the GitHub API based on the
   * provided settings.
   *
   * @name .del
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  del: function(path, data, cb) {
    this.request('DELETE', path, data, cb);
    return this;
  },

  /**
   * Makes a single `PATCH` request to the GitHub API based on the
   * provided settings.
   *
   * @name .patch
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  patch: function(path, data, cb) {
    this.request('PATCH', path, data, cb);
    return this;
  },

  /**
   * Makes a single `POST` request to the GitHub API based on the
   * provided settings.
   *
   * @name .post
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  post: function(path, data, cb) {
    this.request('POST', path, data, cb);
    return this;
  },

  /**
   * Makes a single `PUT` request to the GitHub API based on the
   * provided settings.
   *
   * @name .put
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  put: function(path, data, cb) {
    this.request('PUT', path, data, cb);
    return this;
  }
});

/**
 * Static method for delegating non-enumerable properties from
 * the given `object` onto the `GitHub.prototype`. In other words,
 * this is used to extend the class with additional methods.
 *
 * See the [delegate example](./examples/delegate.js) for more details.
 *
 * @param  {Object} `receiver` The receiver object.
 * @param  {Object} `methods` Object with methods to add to the prototype.
 */

GitHub.delegate = function(methods) {
  delegate(GitHub.prototype, methods);
};

/**
 * Convenience method for inheriting `GitHub`. Extends
 * prototype and static methods.
 *
 * @param  {Object} `Ctor`
 * @api public
 */

GitHub.extend = function (Ctor) {
  util.inherits(Ctor, GitHub);
  extend(Ctor, GitHub);
};

/**
 * Expose `GitHub`
 */

module.exports = GitHub;
