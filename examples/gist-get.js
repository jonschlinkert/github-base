var fs = require('fs');
var GitHub = require('..');
var github = new GitHub(require('./auth'));

/**
 * Get a gist
 */

github.get('/gists/bd139161a425896f35f8', function(err, res) {
  console.log(err, res);
});
