var fs = require('fs');
var GitHub = require('..');
var github = new GitHub(require('./auth'));

/**
 * Update a gist
 */

var opts = {
  files: {'readme.md': { content: fs.readFileSync('README.md', 'utf8') }}
};

github.patch('/gists/bd139161a425896f35f8', opts, function(err, res) {
  console.log(err, res);
});

