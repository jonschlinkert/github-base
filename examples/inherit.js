var auth = require('./auth');
var GitHub = require('../');

/**
 * Inherit and extend `GitHub`
 */

function User(options) {
  GitHub.call(this, options);
}

GitHub.extend(User);

User.prototype.orgs = function (cb) {
  this.get('/user/orgs', cb);
};

/**
 * Usage
 */

var user = new User(auth);
user.orgs(function (err, res) {
  console.log(res);
  //=> do stuff with res
});
