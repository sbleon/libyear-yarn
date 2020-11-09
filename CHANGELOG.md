Changelog
=========

## Unreleased

#### Breaking changes
- None

#### Added
- None

#### Fixed
- None

---

## v0.1.11

#### Breaking changes
- None

#### Added
- None

#### Fixed
- Don't crash when a dependency comes from a git URL instead of from NPM registry. (#4)

---

## v0.1.10

#### Breaking changes
- None

#### Added
- Use `yarn` instead of `npm` to get release time, eliminating some network requests. (#2)

#### Fixed
- None

---

v0.1.9
------

#### Breaking changes
- None

#### Added
- None

#### Fixed
- `Failed to run: yarn outdated --json` due to a change in the error object when packages
  are out of date.

---

v0.1.8
------

#### Breaking changes
- None

#### Added
- None

#### Fixed
- Fix crash when there are no modules out of date.

---

v0.1.7
------

#### Breaking changes
- None

#### Added
- None

#### Fixed
- Handle new output style from `yarn outdated --json` in yarn 1.2.1+

---

## v0.1.6

#### Breaking changes
- None

#### Added
- None

#### Fixed
- Fix a crashing bug in main error handling. Format error messages more nicely.

---

## v0.1.5

#### Breaking changes
- None

#### Added
- None

#### Fixed
- Restore handling of exit status codes a la libyear-npm.

---

## v0.1.4

First working release
