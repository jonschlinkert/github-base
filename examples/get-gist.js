const GitHub = require('..');
const github = new GitHub(require('./auth'));

// get a gist by id
github.get('/gists/:id', { id: 'bd139161a425896f35f8' })
  .then(res => console.log(res.body))
  .catch(console.error);
