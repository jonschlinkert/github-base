var GitHub = require('..');
var github = new GitHub(require('./auth'));

// get a list of orgs for the authenticated user
github.get('/user/orgs')
  .then(res => console.log(res.body))
  .catch(console.error);
