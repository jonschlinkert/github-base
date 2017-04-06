# github-base [![NPM version](https://img.shields.io/npm/v/github-base.svg?style=flat)](https://www.npmjs.com/package/github-base) [![NPM monthly downloads](https://img.shields.io/npm/dm/github-base.svg?style=flat)](https://npmjs.org/package/github-base)  [![NPM total downloads](https://img.shields.io/npm/dt/github-base.svg?style=flat)](https://npmjs.org/package/github-base) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/github-base.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/github-base)

> JavaScript wrapper that greatly simplifies working with GitHub's API.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save github-base
```

**Heads up!**

This lib was completely refactored in `v0.2.0`. Please see the [API documentation](#API) for more details.

**About**

This library provides the necessary methods for creating your own GitHub API library or more specific functionality built on top of these methods.

* [.request](#request): the base handler all of the GitHub API VERBS: `GET`, `PUT`, `POST`, `DELETE`, `PATCH`
* [.get](#get): proxy for `request('GET', path, data, cb)`
* [.paged](#paged): makes repeat `.get()` requests until the page of data has been retrieved.
* [.del](#del): proxy for `request('DEL', path, data, cb)`
* [.patch](#patch): proxy for `request('PATCH', path, data, cb)`
* [.post](#post): proxy for `request('POST', path, data, cb)`
* [.put](#put): proxy for `request('PUT', path, data, cb)`

## Usage

```js
var GitHub = require('github-base');
var github = new GitHub({
  username: YOUR_USERNAME,
  password: YOUR_PASSWORD,
});

// or 
var github = new GitHub({
  token: YOUR_TOKEN
});

// or 
var github = new GitHub({
  bearer: YOUR_JWT
});
```

## Why another "GitHub API" lib?

Every other GitHub API library I found either had a [huge dependency tree](https://github.com/sindresorhus/gh-got), tries to be [everything to everyone](https://github.com/michael/github/blob/master/package.json#L45-L56), was [too bloated with boilerplace code](https://github.com/mikedeboer/node-github/tree/master/templates), was too opinionated or not maintained.

## API

### [GitHub](index.js#L18)

Create an instance of `GitHub` with the given options.

**Params**

* `options` **{Object}**

**Example**

```js
var GitHub = require('github-base');
var github = new GitHub(options);
```

### [.request](index.js#L59)

Uses [simple-get](https://github.com/feross/simple-get) to make a single request to the GitHub API, based on the provided settings. Supports any of the GitHub API VERBs:

* `GET`
* `PUT`
* `POST`
* `DELETE`
* `PATCH`

**Params**

* `method` **{String}**: The http VERB to use
* `url` **{String}**: GitHub API URL to use.
* `options` **{Options}**: Request options.
* `cb` **{Function}**

**Example**

```js
//example..request
github.request('GET', '/user/orgs', function (err, res) {
  //=> array of orgs
});
```

### [.get](index.js#L91)

Makes a single `GET` request to the GitHub API based on the provided settings.

**Params**

* `path` **{String}**: path to append to the GitHub API URL.
* `options` **{Options}**: Request options.
* `cb` **{Function}**

**Example**

```js
// get orgs for the authenticated user
github.get('/user/orgs', function (err, res) {
  //=> array of orgs
});

// get gists for the authenticated user
github.get('/gists', function (err, res) {
  //=> array of gists
});
```

### [.paged](index.js#L113)

Performs a request using [simple-get](https://github.com/feross/simple-get), and then if necessary requests additional paged content based on the response. Data from all pages are concatenated together and buffered until the last page of data has been retrieved.

**Params**

* `path` **{String}**: path to append to the GitHub API URL.
* `cb` **{Function}**

**Example**

```js
// get all repos for the authenticated user
var url = '/user/repos?type=all&per_page=1000&sort=updated';
github.paged(url, function(err, res) {
  console.log(res);
});
```

### [.del](index.js#L138)

Makes a single `DELETE` request to the GitHub API based on the provided settings.

**Params**

* `path` **{String}**: path to append to the GitHub API URL.
* `options` **{Options}**: Request options.
* `cb` **{Function}**

**Example**

```js
// un-follow someone
github.del('/user/following/someoneelse', function(err, res) {
  console.log(res);
});
```

### [.patch](index.js#L161)

Makes a single `PATCH` request to the GitHub API based on the provided settings.

**Params**

* `path` **{String}**: path to append to the GitHub API URL.
* `options` **{Options}**: Request options.
* `cb` **{Function}**

**Example**

```js
// update a gist
var fs = require('fs');
var opts = {files: {'readme.md': { content: '# My Readme...' }}};
github.patch('/gists/bd139161a425896f35f8', opts, function(err, res) {
  console.log(err, res);
});
```

### [.post](index.js#L183)

Makes a single `POST` request to the GitHub API based on the provided settings.

**Params**

* `path` **{String}**: path to append to the GitHub API URL.
* `options` **{Options}**: Request options.
* `cb` **{Function}**

**Example**

```js
// create a new repo
var opts = { name:  'new-repo-name' };
github.post('/user/repos', opts, function(err, res) {
  console.log(res);
});
```

### [.put](index.js#L204)

Makes a single `PUT` request to the GitHub API based on the provided settings.

**Params**

* `path` **{String}**: path to append to the GitHub API URL.
* `options` **{Options}**: Request options.
* `cb` **{Function}**

**Example**

```js
// follow someone
github.put('/user/following/jonschlinkert', function(err, res) {
  console.log(res);
});
```

### [#extend](index.js#L226)

Static method for inheriting the prototype and static methods of the `Base` class. This method greatly simplifies the process of creating inheritance-based applications. See [static-extend](https://github.com/jonschlinkert/static-extend) for more details.

**Params**

* `Ctor` **{Function}**: constructor to extend

**Example**

```js
var GitHub = require('github-base');
function MyApp() {
  GitHub.call(this);
}
GitHub.extend(MyApp);
```

## About

### Related projects

* [ask-for-github-auth](https://www.npmjs.com/package/ask-for-github-auth): Prompt a user for their github authentication credentials and save the results. | [homepage](https://github.com/doowb/ask-for-github-auth "Prompt a user for their github authentication credentials and save the results.")
* [gists](https://www.npmjs.com/package/gists): Methods for working with the GitHub Gist API. Node.js/JavaScript | [homepage](https://github.com/jonschlinkert/gists "Methods for working with the GitHub Gist API. Node.js/JavaScript")
* [github-contributors](https://www.npmjs.com/package/github-contributors): Generate a markdown or JSON list of contributors for a project using the GitHub API. | [homepage](https://github.com/jonschlinkert/github-contributors "Generate a markdown or JSON list of contributors for a project using the GitHub API.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 31 | [jonschlinkert](https://github.com/jonschlinkert) |
| 7 | [tunnckoCore](https://github.com/tunnckoCore) |
| 6 | [doowb](https://github.com/doowb) |

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.3, on April 06, 2017._