var GitHub = require('..');
var github = new GitHub(require('./auth'));

github.put('/user/following/jonschlinkert', function(err, res) {
  if (err) return console.error(err);
  console.log(res);
});
