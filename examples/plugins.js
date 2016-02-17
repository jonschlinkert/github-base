
var Github = require('../index');
var github = new Github(require('./_fake_user'));

github.use(function (app) {
  // direcly from `npm.im/gists`
  app.gists = {
    /**
     * List a user's gists.
     *
     * ```js
     * // equivalent of `GET /users/:username/gists`
     * gists.list({username: 'doowb'}, cb);
     * ```
     * @name .list
     * @param {Object} `opts`
     * @param {String} `opts.username`
     * @param {Function} `callback`
     * @api public
     */

    list: function (opts, cb) {
      app.get('/users/:username/gists', opts, cb);
      return app;
    }
  };
});

github.gists.list({owner: 'tunnckoCore'}, function (err, res) {
  console.log(err, res);
});
