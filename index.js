'use strict';

var util = require('util');
var gh = require('github-request');
var extend = require('extend-shallow');
var utils = require('./lib/utils');

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

  this.options = options || {};
  this.defaults = utils.defaults(this.options);

  if (!this.options.apiurl) {
    this.options.apiurl = 'https://api.github.com';
  }

  this.interpolate = function(opts) {
    var data = extend({}, this.options, opts);
    return utils.interpolate(opts.path, data);
  }.bind(this);
}

/**
 * GitHub prototype methods
 */

GitHub.prototype = {
  constructor: GitHub,

  /**
   * Uses [github-request][] to make a single request to the
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
    var opts = this.defaults(method, path, data);
    opts.path = this.interpolate(opts);
    gh.request(opts, data, cb);
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
   * Performs a request using [github-request][], and then if necessary
   * requests additional paged content based on the response. Data from
   * all pages are concatenated together and buffered until the last
   * page of data has been retrieved.
   *
   * @name .getAll
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Function} `cb`
   * @api public
   */

  getAll: function(path, cb) {
    var opts = this.defaults('GET', path);
    opts.path = this.interpolate(opts);
    gh.requestAll(opts, cb);
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
};

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
  utils.delegate(GitHub.prototype, methods);
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
