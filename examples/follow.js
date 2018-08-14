const GitHub = require('..');
const github = new GitHub(require('./auth'));

// follow a user
github.put('/user/following/jonschlinkert')
  .then(res => console.log(res))
  .catch(console.error);
