# github-base [![NPM version](https://img.shields.io/npm/v/github-base.svg?style=flat)](https://www.npmjs.com/package/github-base) [![NPM monthly downloads](https://img.shields.io/npm/dm/github-base.svg?style=flat)](https://npmjs.org/package/github-base) [![NPM total downloads](https://img.shields.io/npm/dt/github-base.svg?style=flat)](https://npmjs.org/package/github-base) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/github-base.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/github-base) [![Windows Build Status](https://img.shields.io/appveyor/ci/jonschlinkert/github-base.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/jonschlinkert/github-base)

> JavaScript wrapper that greatly simplifies working with GitHub's API.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save github-base
```

**Heads up!**

This lib was completely refactored in `v0.2.0`. Please see the [API documentation](#API) for more details.

## Overview

This library provides the  for creating your own GitHub API library or more specific functionality built on top of these methods.

* [.request](#request): the base handler all of the GitHub API VERBS: `GET`, `PUT`, `POST`, `DELETE`, `PATCH`
* [.get](#get): proxy for `.request('GET', path, options, cb)`
* [.del](#del): proxy for `.request('DEL', path, options, cb)`
* [.patch](#patch): proxy for `.request('PATCH', path, options, cb)`
* [.post](#post): proxy for `.request('POST', path, options, cb)`
* [.put](#put): proxy for `.request('PUT', path, options, cb)`
* [.paged](#paged): recursively makes `GET` requests until all pages have been retrieved.

Jump to the [API section](#API) for more details.

## Usage

Add github-base to your node.js/JavaScript project with the following line of code:

```js
const GitHub = require('github-base');
```

Create an instance of `GitHub` with an optional `options` object.

```js
const github = new GitHub({ /* options */ });
```

**Example usage**

`GET` all gists for a user (all methods take a callback, or return a promise if a callback isn't passed):

```js
// promise
github.paged('/users/:owner/gists', { owner: 'jonschlinkert' })
  .then(res => console.log(res))
  .catch(console.error);

// callback
github.paged('/users/:owner/gists', { owner: 'jonschlinkert' }, (err, res) => {
  if (err) return console.log(err);
  console.log(res);
});
```

## API

_(All request methods take a callback, or return a promise if a callback isn't passed as the last argument)_.

### [GitHub](index.js#L18)

Create an instance of `GitHub` with the given options.

**Params**

* `options` **{Object}**

**Example**

```js
const GitHub = require('github-base');
const github = new GitHub([options]);
```

### [.request](index.js#L44)

Uses [needle](https://github.com/tomas/needle) to make a request to the GitHub API. Supports the following verbs: `GET`, `PUT`, `POST`, `PATCH`, and `DELETE`. Takes a callback or returns a promise.

**Params**

* `method` **{String}**: The http VERB to use
* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// list all orgs for the authenticated user
const auth = require('./local-private-auth-info');
const github = new GitHub(auth);
github.request('GET', '/user/orgs')
  .then(res => console.log(res.body));
```

### [.get](index.js#L72)

Make a `GET` request to the GitHub API.

**Params**

* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// get a list of orgs for the authenticated user
github.get('/user/orgs')
  .then(res => console.log(res.body));

// get gists for the authenticated user
github.get('/gists')
  .then(res => console.log(res.body));
```

### [.del](index.js#L93)

Make a `DELETE` request to the GitHub API.

**Params**

* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// un-follow someone
github.del('/user/following/:some_username', { some_username: 'whatever' })
  .then(() => {
    // do something else
  });
```

### [.patch](index.js#L116)

Make a `PATCH` request to the GitHub API.

**Params**

* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// update a gist
const fs = require('fs');
const options = { files: { 'readme.md': { content: fs.readFileSync('README.md', 'utf8') } } };
github.patch('/gists/bd139161a425896f35f8', options)
  .then(() => {
    // do something else
  });
```

### [.post](index.js#L137)

Make a `POST` request to the GitHub API.

**Params**

* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// create a new repository
github.post('/user/repos', { name: 'new-repo-name' })
  .then(() => {
    // do something else
  });
```

### [.put](index.js#L158)

Make a `PUT` request to the GitHub API.

**Params**

* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// follow someone
github.put('/user/following/jonschlinkert')
  .then(() => {
    // do something else
  });
```

### [.paged](index.js#L178)

Recursively make GET requests until all pages of records are returned.

**Params**

* `path` **{String}**: The path to append to the base GitHub API URL.
* `options` **{Options}**: Request [options](#options).
* `callback` **{Function}**: If a callback is not passed, a promise will be returned.

**Example**

```js
// get all repos for the authenticated user
github.paged('/user/repos?type=all&per_page=1000&sort=updated')
  .then(res => console.log(res.pages))
  .catch(console.error)
```

### .use

Register plugins with [use](https://github.com/jonschlinkert/use).

```js
const github = new GitHub();

github.use(function() {
  // do stuff with the github-base instance
});
```

## Authentication

There are a few ways to authenticate, all of them require info to be passed on the [options](#options).

```js
const github = new GitHub({
  username: YOUR_USERNAME,
  password: YOUR_PASSWORD,
});

// or 
const github = new GitHub({
  token: YOUR_TOKEN
});

// or 
const github = new GitHub({
  bearer: YOUR_JWT
});
```

## Paths and placeholders

Paths are similar to router paths, where placeholders in the given string are replaced with values from the options. For instance, the path in the following example:

```js
const github = new GitHub();
const options = { user: 'jonschlinkert', repo: 'github-base', subscribed: true };

github.put('/repos/:user/:repo/subscription', options);
```

Expands to:

```js
'/repos/jonschlinkert/github-base/subscription'
```

Placeholder names are also arbitrary, you can make them whatever you want as long as all placeholder names can be resolved using values defined on the options.

## Options

Options may be passed to the constructor when instantiating, and/or set on the instance directly, and/or passed to any of the methods.

**Examples**

```js
// pass to constructor
const github = new GitHub({ user: 'doowb' });

// and/or directly set on instance options
github.options.user = 'doowb';

// and/or pass to a method
github.get('/users/:user/gists', { user: 'doowb' })
```

### options.query

**Type**: `object`

**Default**: `{ per_page: 100 }` for [get](#get) and [paged](#paged) requests, `undefined` for all other requests.

Pass an object to stringify and append to the URL using the `.stringify` method from [qs](https://github.com/ljharb/qs).

**Examples**

```js
github.paged('/users/:user/gists', { user: 'doowb', query: { per_page: 30 } })
  .then(res => {
    console.log(res.pages);
  });
```

You can also manually append the query string:

```js
github.paged('/users/:user/gists?per_page=30', { user: 'doowb' })
  .then(res => {
    console.log(res.pages);
  });
```

## Why another "GitHub API" lib?

Every other GitHub API library I found either had a [huge dependency tree](https://github.com/sindresorhus/gh-got), tries to be [everything to everyone](https://github.com/michael/github/blob/master/package.json#L45-L56), was [too bloated with boilerplace code](https://github.com/mikedeboer/node-github/tree/master/templates), was too opinionated, or was not maintained.

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [ask-for-github-auth](https://www.npmjs.com/package/ask-for-github-auth): Prompt a user for their github authentication credentials and save the results. | [homepage](https://github.com/doowb/ask-for-github-auth "Prompt a user for their github authentication credentials and save the results.")
* [gists](https://www.npmjs.com/package/gists): Methods for working with the GitHub Gist API. Node.js/JavaScript | [homepage](https://github.com/jonschlinkert/gists "Methods for working with the GitHub Gist API. Node.js/JavaScript")
* [github-contributors](https://www.npmjs.com/package/github-contributors): Generate a markdown or JSON list of contributors for a project using the GitHub API. | [homepage](https://github.com/jonschlinkert/github-contributors "Generate a markdown or JSON list of contributors for a project using the GitHub API.")

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 40 | [jonschlinkert](https://github.com/jonschlinkert) |
| 10 | [doowb](https://github.com/doowb) |
| 7 | [charlike-old](https://github.com/charlike-old) |

### Author

**Jon Schlinkert**

* [linkedin/in/jonschlinkert](https://linkedin.com/in/jonschlinkert)
* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on February 10, 2018._