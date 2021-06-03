<!--
Guiding Principles
- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.
- Mention whether you follow Semantic Versioning.

Types of changes
- Added for new features.
- Changed for changes in existing functionality.
- Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.
- Breaking changes for break in new revision
- Other for notable changes that do not
 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **⚠ Alphas may contain breaking changes between releases.**
>
> When the release is NOT a major release, the breaking changes will only be relative to the prior `alpha` release
>
> As this package is not released (kind of), this change log will be cleared on the official release of `v1`

## 0.0.0-alpha.1

### Changes

-   Updated the `gitnore`, `tsconfig` and `npm` package to appropriately handle the new `lib/` folder
-   Added dependencies for, and tweaked, linting
-   Added `.prettierrc` for consistent formatting (and applied it)
-   Added some package scripts for linting, formatting, building, etc
-   Added comment to a public static method
-   Removed `.npmignore` in favour of `"files"` in the `package.json`

<!--
## [1.0.0] - 2021-06-##

**This was the first release**

[unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.0.0...development
[1.0.0]: https://github.com/olivierlacan/keep-a-changelog/release/tag/v1.0.0
 -->
