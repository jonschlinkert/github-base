const fs = require('fs');
const path = require('path');
const GitHub = require('..');
const github = new GitHub(require('./auth'));

/**
 * Update a gist
 */

const options = {
  files: {
    'README.md': {
      content: fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8')
    }
  }
};

github.patch('/gists/bd139161a425896f35f8', options)
  .then(res => console.log(res.body))
  .catch(console.error);
