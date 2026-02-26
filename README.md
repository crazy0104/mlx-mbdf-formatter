# MBDF Formatter (VS Code Extension)

VS Code extension for formatting MeLiBu Bus Description File (MBDF) files, with a one-click format button in the editor toolbar.

## Build & Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [VS Code](https://code.visualstudio.com/) (for development)

### Setup

```bash
# Clone the repository
git clone https://github.com/crazy0104/mlx-mbdf-formatter.git
cd mlx-mbdf-formatter

# Install dependencies
npm install

# Compile TypeScript
npm run compile
```

### Run Extension (Development)

1. Open the project in VS Code.
2. Press `F5` or run **Run > Start Debugging** to launch the Extension Development Host.
3. In the new window, open an MBDF file and test formatting.

### Package VSIX

```bash
npm run package
```

This produces `mbdf-formatter-<version>.vsix` in the project root. Install it via **Extensions > ... > Install from VSIX**.

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