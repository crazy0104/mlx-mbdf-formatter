# MBDF Formatter (VSCode Extension)

VSCode扩展，用于格式化MeLiBu Bus Description File (MBDF)文件，并提供右侧按钮一键格式化。

## 功能

- 右侧状态栏按钮：`MBDF Format`
- 命令：`Format MBDF Document`
- 快捷键：`Shift+Alt+F`（仅MBDF文件）
- 语法高亮（基础）

## 配置

在VSCode设置中加入：

```json
{
  "mbdf.formatter.indentSize": 4,
  "mbdf.formatter.formatOnSave": false
}
```

- `indentSize`: 缩进大小（1-16）
- `formatOnSave`: 保存时自动格式化（可配合 `editor.formatOnSave`）
