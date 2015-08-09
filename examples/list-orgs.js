var GitHub = require('..');
var github = new GitHub(require('./_fake_user'));

github.get('/user/orgs', function(err, res) {
  if (err) return console.error(err);
  console.log(res);
});

