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
  this.options.apiurl = this.options.apiurl || 'https://api.github.com';
  this.defaults = utils.defaults(this.options);
}

/**
 * GitHub prototype methods
 */

GitHub.prototype = {
  constructor: GitHub,

  /**
   * Make a request to the GitHub API. Supports any GitHub API
   * VERB: `GET`, `PUT`, `POST`, `DELETE`, `PATCH`
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
    gh.request(opts, data, cb);
  },

  /**
   * Make a `GET` request to the GitHub API.
   *
   * @name .get
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  get: function(path, data, cb) {
    this.request('GET', path, data, cb);
  },

  /**
   * Create paginated requests to get all items regardless
   * of the GitHub limit.
   *
   * @name .getAll
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Function} `cb`
   */

  getAll: function(path, cb) {
    gh.requestAll(this.defaults('GET', path), cb);
  },

  /**
   * Make a `DELETE` request to the GitHub API.
   *
   * @name .del
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  del: function(path, data, cb) {
    this.request('DELETE', path, data, cb);
  },

  /**
   * Make a `PATCH` request to the GitHub API.
   *
   * @name .patch
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  patch: function(path, data, cb) {
    this.request('PATCH', path, data, cb);
  },

  /**
   * Make a `POST` request to the GitHub API.
   *
   * @name .post
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  post: function(path, data, cb) {
    this.request('POST', path, data, cb);
  },

  /**
   * Make a `put` request to the GitHub API.
   *
   * @name .put
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `data` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  put: function(path, data, cb) {
    this.request('PUT', path, data, cb);
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
