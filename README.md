# MBDF Formatter (VS Code Extension)

VS Code extension for formatting MeLiBu Bus Description File (MBDF) files, with a one-click format button in the editor toolbar.

## Features

- Editor toolbar button: `MBDF Format`
- Command: `Format MBDF Document`
- Shortcut: `Shift+Alt+F` (MBDF files only)
- Basic syntax highlighting

## Configuration

Add the following to VS Code settings:

```json
{
  "mbdf.formatter.indentSize": 4,
  "mbdf.formatter.formatOnSave": false
}
```

- `indentSize`: Number of spaces for indentation (1–16)
- `formatOnSave`: Format on save (works with `editor.formatOnSave`)

## Demo

![Usage: format MBDF with toolbar button and shortcut](https://github.com/crazy0104/mlx-mbdf-formatter/raw/main/example/demo.gif)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.