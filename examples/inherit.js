var fake_user = require('./_fake_user');
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
});

/**
 * Usage
 */

var user = new User({
  username: fake_user.USERNAME,
  password: fake_user.PASSWORD,
});

user.orgs(function (err, res) {
  console.log(res);
  //=> do stuff with res
});
