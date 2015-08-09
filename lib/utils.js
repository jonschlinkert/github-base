'use strict';

/**
 * Expose `utils`
 */

var utils = module.exports;

/**
 * Add a non-enumerable property to `receiver`
 *
 * @param  {Object} `obj`
 * @param  {String} `name`
 * @param  {Function} `val`
 */

utils.defineProp = function defineProp(receiver, key, value) {
  return Object.defineProperty(receiver, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: value
  });
};

/**
 * Delegate non-enumerable properties from `provider` to `receiver`.
 *
 * @param  {Object} `receiver`
 * @param  {Object} `provider`
 */

utils.delegate = function delegate(receiver, provider) {
  for (var method in provider) {
    utils.defineProp(receiver, method, provider[method]);
  }
};

/**
 * Default settings to use for GitHub API requests.
 *
 * @param  {Object} `config`
 * @return {Object}
 */

utils.defaults = function (config) {
  return function defaults(method, path) {
    var opts = config || {};
    opts.path = utils.getURL(path, config.apiurl);
    opts.method = method || 'GET';
    opts.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'user-agent': 'github-base-nodejs',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': utils.createAuth(opts)
    };
    delete opts.password;
    delete opts.username;
    delete opts.token;
    return opts;
  };
};
