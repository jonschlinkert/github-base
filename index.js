'use strict';

var use = require('use');
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
    var proto = Object.create(GitHub.prototype);
    GitHub.apply(proto, arguments);
    return proto;
  }
  use(this);
  this.defaults = utils.defaults(options);
}

/**
 * GitHub prototype methods
 */

GitHub.prototype = {
  constructor: GitHub,

  /**
   * Uses [simple-get][] to make a single request to the GitHub API, based on
   * the provided settings. Supports any of the GitHub API VERBs:
   *
   *   - `GET`
   *   - `PUT`
   *   - `POST`
   *   - `DELETE`
   *   - `PATCH`
   *
   * ```js
   * //example..request
   * github.request('GET', '/user/orgs', function (err, res) {
   *   //=> array of orgs
   * });
   * ```
   * @name .request
   * @param  {String} `method` The http VERB to use
   * @param  {String} `url` GitHub API URL to use.
   * @param  {Options} `options` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  request: function(method, path, options, cb) {
    if (typeof options === 'function') {
      return this.request.call(this, method, path, {}, options);
    }
    if (typeof cb !== 'function') {
      throw new TypeError('expected callback to be a function');
    }
    utils.request(this.defaults(method, path, options), cb);
  },

  /**
   * Makes a single `GET` request to the GitHub API based on the
   * provided settings.
   *
   * ```js
   * // get orgs for the authenticated user
   * github.get('/user/orgs', function (err, res) {
   *   //=> array of orgs
   * });
   *
   * // get gists for the authenticated user
   * github.get('/gists', function (err, res) {
   *   //=> array of gists
   * });
   * ```
   * @name .get
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  get: function(path, options, cb) {
    this.request('GET', path, options, cb);
  },

  /**
   * Performs a request using [simple-get][], and then if necessary requests
   * additional paged content based on the response. Data from all pages are
   * concatenated together and buffered until the last page of data has been retrieved.
   *
   * ```js
   * // get all repos for the authenticated user
   * var url = '/user/repos?type=all&per_page=1000&sort=updated';
   * github.paged(url, function(err, res) {
   *   console.log(res);
   * });
   * ```
   * @name .paged
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Function} `cb`
   * @api public
   */

  paged: function(path, options, cb) {
    if (typeof options === 'function') {
      this.paged.call(this, path, {}, options);
      return;
    }
    utils.paged(this.defaults('GET', path, options), cb);
  },

  /**
   * Makes a single `DELETE` request to the GitHub API based on the
   * provided settings.
   *
   * ```js
   * // un-follow someone
   * github.del('/user/following/someoneelse', function(err, res) {
   *   console.log(res);
   * });
   * ```
   * @name .del
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  del: function(path, options, cb) {
    this.request('DELETE', path, options, cb);
  },

  /**
   * Makes a single `PATCH` request to the GitHub API based on the
   * provided settings.
   *
   * ```js
   * // update a gist
   * var fs = require('fs');
   * var opts = {files: {'readme.md': { content: '# My Readme...' }}};
   * github.patch('/gists/bd139161a425896f35f8', opts, function(err, res) {
   *   console.log(err, res);
   * });
   * ```
   * @name .patch
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  patch: function(path, options, cb) {
    this.request('PATCH', path, options, cb);
  },

  /**
   * Makes a single `POST` request to the GitHub API based on the
   * provided settings.
   *
   * ```js
   * // create a new repo
   * var opts = { name:  'new-repo-name' };
   * github.post('/user/repos', opts, function(err, res) {
   *   console.log(res);
   * });
   * ```
   * @name .post
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  post: function(path, options, cb) {
    this.request('POST', path, options, cb);
  },

  /**
   * Makes a single `PUT` request to the GitHub API based on the provided
   * settings.
   *
   * ```js
   * // follow someone
   * github.put('/user/following/jonschlinkert', function(err, res) {
   *   console.log(res);
   * });
   * ```
   * @name .put
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `cb`
   * @api public
   */

  put: function(path, options, cb) {
    this.request('PUT', path, options, cb);
  }
};

/**
 * Static method for inheriting the prototype and static methods of the `Base` class.
 * This method greatly simplifies the process of creating inheritance-based applications.
 * See [static-extend][] for more details.
 *
 * ```js
 * var GitHub = require('github-base');
 * function MyApp() {
 *   GitHub.call(this);
 * }
 * GitHub.extend(MyApp);
 * ```
 * @name #extend
 * @param {Function} `Ctor` constructor to extend
 * @api public
 */

utils.define(GitHub, 'extend', utils.staticExtend(GitHub));

/**
 * Expose `GitHub`
 */

module.exports = GitHub;
