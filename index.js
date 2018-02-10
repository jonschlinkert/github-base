'use strict';

const use = require('use');
const utils = require('./lib/utils');

/**
 * Create an instance of `GitHub` with the given options.
 *
 * ```js
 * const GitHub = require('github-base');
 * const github = new GitHub(options);
 * ```
 *
 * @param {Object} `options`
 * @api public
 */

class GitHub {
  constructor(options) {
    this.options = options;
    this.defaults = utils.defaults(this.options);
    use(this);
  }

  /**
   * Uses [needle][] to make a request to the GitHub API with the provided settings.
   * Supports any of the GitHub API VERBs:
   *
   *   - `GET`
   *   - `PUT`
   *   - `POST`
   *   - `PATCH`
   *   - `DELETE`
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
   * @param  {Function} `callback`
   * @api public
   */

  request(method, path, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    const opts = Object.assign({}, this.options, options);
    return utils.request(method, path, opts, callback);
  }

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
   * @param  {Function} `callback`
   * @api public
   */

  get(path, options, callback) {
    return this.request('GET', path, options, callback);
  }

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
   * @param  {Function} `callback`
   * @api public
   */

  del(path, options, callback) {
    return this.request('DELETE', path, options, callback);
  }

  /**
   * Makes a single `PATCH` request to the GitHub API based on the
   * provided settings.
   *
   * ```js
   * // update a gist
   * const fs = require('fs');
   * const opts = {files: {'readme.md': { content: '# My Readme...' }}};
   * github.patch('/gists/bd139161a425896f35f8', opts, function(err, res) {
   *   console.log(err, res);
   * });
   * ```
   * @name .patch
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `callback`
   * @api public
   */

  patch(path, options, callback) {
    return this.request('PATCH', path, options, callback);
  }

  /**
   * Makes a single `POST` request to the GitHub API based on the
   * provided settings.
   *
   * ```js
   * // create a new repo
   * const opts = { name:  'new-repo-name' };
   * github.post('/user/repos', opts, function(err, res) {
   *   console.log(res);
   * });
   * ```
   * @name .post
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Options} `options` Request options.
   * @param  {Function} `callback`
   * @api public
   */

  post(path, options, callback) {
    return this.request('POST', path, options, callback);
  }

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
   * @param  {Function} `callback`
   * @api public
   */

  put(path, options, callback) {
    return this.request('PUT', path, options, callback);
  }

  /**
   *
   *
   * ```js
   * // get all repos for the authenticated user
   * github.paged('/user/repos?type=all&per_page=1000&sort=updated')
   *   .then(res => console.log(res.pages))
   *   .catch(console.error)
   * ```
   * @name .paged
   * @param  {String} `path` path to append to the GitHub API URL.
   * @param  {Function} `callback`
   * @api public
   */

  paged(path, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    const opts = Object.assign({}, this.options, options);
    return utils.paged('GET', path, opts, callback);
  }
}

/**
 * Expose `GitHub`
 */

module.exports = GitHub;
