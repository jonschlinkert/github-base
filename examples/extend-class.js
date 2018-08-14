const GitHub = require('..');

/**
 * Extend `GitHub` class
 */

class User extends GitHub {
  orgs(...args) {
    return this.get('/user/orgs', ...args);
  }
}

/**
 * Usage
 */

const user = new User(require('./auth'));
user.orgs()
  .then(res => console.log(res))
  .catch(console.error);
