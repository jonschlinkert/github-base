const GitHub = require('..');
const github = new GitHub(require('./auth'));

// get all gists for the authenticated user
github.get('/gists')
  .then(res => console.log(res.body))
  .catch(console.error);
