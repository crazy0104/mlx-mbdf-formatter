# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1]

### Added

- Syntax highlighting for MBDF keywords with distinct colors:
  - **keyword.definition.mbdf**: file-level config keys (`description_file`, `bus_protocol_version`, `bus_language_version`, `bus_speed`)
  - **keyword.control.mbdf**: block names (`Nodes`, `Signals`, `Frames`, etc.)
  - **keyword.node.mbdf**: node/attribute keywords
  - **keyword.special.mbdf**: special features (`Wakeup`, `AutoAddress`, etc.)
  - **keyword.other.mbdf**: values and units (`Master`, `M2S`, `DATA`, `delay`, `ms`, etc.)
- README Demo section with usage GIF (hosted via GitHub URL).
- `repository` in package.json for vsce and Marketplace link resolution.

### Changed

- README content in English.
- Comment color: use green (`#6A9955`) for comments to match common themes.
- Exclude `example/demo.gif` from VSIX via .vscodeignore to reduce package size.

### Fixed

- Multi-line block comments (`/* ... */`) now receive comment scope and color correctly by using `begin`/`end` in the grammar instead of a single `match`.
- Formatter: insert a newline after `{` when there is content on the same line (e.g. `Nodes {Master: ...` → `Nodes {\n    Master: ...`).
- Formatter: newline after block comment `*/` when content follows (e.g. `/* comment */SigTestD1: ...` → comment on one line, statements on following lines).
- Formatter: one statement per line; semicolon-separated statements on the same line are split into separate lines.

## [1.0.0]

### Added

- Initial release of MBDF Formatter.
- Format MeLiBu Bus Description File (MBDF) with configurable indent size.
- Editor toolbar button: **MBDF Format**.
- Commands: **Format MBDF Document**, **Format MBDF Selection**.
- Shortcut: `Shift+Alt+F` (MBDF files only).
- Basic syntax highlighting for MBDF (comments, strings, numbers, operators).
- Configuration: `mbdf.formatter.indentSize` (1–16), `mbdf.formatter.formatOnSave`, `mbdf.formatter.version`.
- Package script for building VSIX: `npm run package`.

[1.0.1]: https://github.com/crazy0104/mlx-mbdf-formatter/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/crazy0104/mlx-mbdf-formatter/releases/tag/v1.0.0
