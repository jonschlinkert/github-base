var auth = require('./auth');
var GitHub = require('..');
var github = new GitHub(auth);

github.paged('/users/jonschlinkert/repos')
  .then(res => console.log(res.pages[0].body))
  .catch(console.error)
