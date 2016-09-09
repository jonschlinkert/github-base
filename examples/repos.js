var auth = require('./auth');
var GitHub = require('..');
var github = new GitHub(auth);

github.paged('/users/jonschlinkert/repos', function(err, repos) {
  if (err) return console.log(err);

  console.log(repos);
  console.log('COUNT:', repos.length);
});

