var GitHub = require('..');
var github = new GitHub(require('./_fake_user'));

var rand = require('randomatic');
var name = rand('*', 10);

github.post('/user/repos', { name:  name }, function(err, res) {
  if (err) return console.error(err);
  console.log(res);
});
