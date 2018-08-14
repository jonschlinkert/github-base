# Release history

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<details>
  <summary><strong>Guiding Principles</strong></summary>

- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each versions is displayed.
- Mention whether you follow Semantic Versioning.

</details>

<details>
  <summary><strong>Types of changes</strong></summary>

From v1.0 forward, changelog entries are classified using the following labels _(from [keep-a-changelog](http://keepachangelog.com/)_):

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be-removed features.
- `Removed` for removed features.
- `Fixed` for any bug fixes.

</details>

## [1.0.0] - 2018-08-14

**Changed**

- refactored to use es6 class, updated examples and docs.
- renamed `.del` to `.delete`

### Added

- added support `options.query` and query strings on the URL


## [0.5.4] - 2017-04-19

- ensure simple-get does not try to parse json

## [0.5.3] - 2017-04-19

- fix annoying json parse error from simple-get
- run update, update deps

## [0.5.2] - 2017-04-06

- allow setting username/password on environment. closes #15
- allow passing in a bearer token for authentication

## [0.5.1] - 2016-09-10

- move `opts` inside closure

## [0.5.0] - 2016-09-09

- run update
- adds readme task to verb config
- refactor

## [0.4.1] - 2016-02-02

- update `.getAll` test, resolves #9
- Merge pull request #10 from tunnckoCore/master

## [0.4.0] - 2015-10-17

- allow making calls without credentials

## [0.3.2] - 2015-10-15

- ensure that original options are used for subsequent requests

## [0.3.1] - 2015-09-14

- update docs

## [0.3.0] - 2015-09-14

- Merge pull request #4 from tunnckoCore/master
- refactor defaults, use `simple-get`
- add/update tests, lint
- introduce `json` option

## [0.2.3] - 2015-08-13

- fix opts

## [0.2.2] - 2015-08-11

- interpolation

## [0.2.1] - 2015-08-09

- paths
- fix links

## [0.2.0] - 2015-08-09

- refactor
- update tests
- docs

## [0.1.1] - 2015-03-31

- shorten
- fix test desc
- clean up

## 0.1.0

- first commit

[1.0.0]: https://github.com/jonschlinkert/github-base/compare/0.5.4...1.0.0
[0.5.4]: https://github.com/jonschlinkert/github-base/compare/0.5.3...0.5.4
[0.5.3]: https://github.com/jonschlinkert/github-base/compare/0.5.2...0.5.3
[0.5.2]: https://github.com/jonschlinkert/github-base/compare/0.5.1...0.5.2
[0.5.1]: https://github.com/jonschlinkert/github-base/compare/0.5.0...0.5.1
[0.5.0]: https://github.com/jonschlinkert/github-base/compare/0.4.1...0.5.0
[0.4.1]: https://github.com/jonschlinkert/github-base/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/jonschlinkert/github-base/compare/0.3.2...0.4.0
[0.3.2]: https://github.com/jonschlinkert/github-base/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/jonschlinkert/github-base/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/jonschlinkert/github-base/compare/0.2.3...0.3.0
[0.2.3]: https://github.com/jonschlinkert/github-base/compare/0.2.2...0.2.3
[0.2.2]: https://github.com/jonschlinkert/github-base/compare/0.2.1...0.2.2
[0.2.1]: https://github.com/jonschlinkert/github-base/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/jonschlinkert/github-base/compare/0.1.1...0.2.0
[0.1.1]: https://github.com/jonschlinkert/github-base/compare/0.1.0...0.1.1

[keep-a-changelog]: https://github.com/olivierlacan/keep-a-changelog

