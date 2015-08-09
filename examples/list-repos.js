var GitHub = require('..');
var github = new GitHub(require('./_fake_user'));
var url = '/user/repos?type=all&per_page=1000&sort=updated';

github.getAll(url, function(err, res) {
  if (err) return console.error(err);
  console.log(res)
});

