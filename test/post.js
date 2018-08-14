'use strict';

require('mocha');
const assert = require('assert');
const auth = require('./support/auth');
const GitHub = require('..');
let github;

describe('.post', function() {
  this.timeout(10000);

  beforeEach(() => (github = new GitHub(auth)));

  describe('should POST /markdown', function() {
    it('should work with `/markdown` endpoint', function() {
      const options = {
        text: 'foo **bar**\n```js\nvar foo = "bar";\n```\nbaz!',
        mode: 'gfm',
        headers: {
          'content-type': 'application/json'
        }
      };

      const expected = `<p>foo <strong>bar</strong></p>
<div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> foo <span class="pl-k">=</span> <span class="pl-s"><span class="pl-pds">"</span>bar<span class="pl-pds">"</span></span>;</pre></div>
<p>baz!</p>`;

      return github.post('/markdown', options).then(res => assert.strictEqual(res.body, expected));
    });

    it('should POST /markdown/raw', function() {
      const options = { body: 'foo **bar** #1', headers: { 'content-type': 'text/plain' } };

      return github.post('/markdown/raw', options)
        .then(res => assert.strictEqual(res.body.toString(), '<p>foo <strong>bar</strong> #1</p>\n'));
    });
  });
});
