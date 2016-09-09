var GitHub = require('..');
var github = new GitHub(require('./auth'));

github.get('/user/orgs', function(err, res) {
  if (err) return console.error(err);
  console.log(res);
});

