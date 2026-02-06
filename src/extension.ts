import * as vscode from 'vscode';

type FormatterState = {
    indentSize: number;
    indentLevel: number;
    inBlockComment: boolean;
    inString: boolean;
};

function isCommentLine(line: string): boolean {
    const trimmed = line.replace(/^[ \t]+/, '');
    return trimmed.startsWith('//');
}

function isBlockCommentStart(line: string): boolean {
    return line.includes('/*');
}

function isBlockCommentEnd(line: string): boolean {
    return line.includes('*/');
}

function isOnlyCommentOrWhitespace(text: string): boolean {
    const trimmed = text.trimStart();
    if (trimmed.length === 0) {
        return true;
    }
    return trimmed.startsWith('//') || trimmed.startsWith('/*');
}

function isStructuralOpenBrace(line: string, bracePos: number): boolean {
    const after = line.slice(bracePos + 1);
    return isOnlyCommentOrWhitespace(after);
}

function isStructuralCloseBrace(line: string): boolean {
    const trimmed = line.trimStart();
    if (!trimmed.startsWith('}')) {
        return false;
    }
    return isOnlyCommentOrWhitespace(trimmed.slice(1));
}

function findUnquotedChar(line: string, target: string, startInString: boolean): number {
    let inString = startInString;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            inString = !inString;
        } else if (!inString && ch === target) {
            return i;
        }
    }
    return -1;
}

function formatLineContent(content: string, state: FormatterState): string {
    let output = '';
    let inSpace = false;
    let inString = state.inString;

    for (let i = 0; i < content.length; i++) {
        const ch = content[i];
        if (ch === '"') {
            inString = !inString;
            output += ch;
            inSpace = false;
            continue;
        }
        if (inString) {
            output += ch;
            inSpace = false;
            continue;
        }
        if (ch === ' ' || ch === '\t') {
            if (!inSpace) {
                output += ' ';
                inSpace = true;
            }
            continue;
        }

        inSpace = false;

        if (ch === ':') {
            output += ':';
            if (i + 1 < content.length && content[i + 1] !== ' ') {
                output += ' ';
            }
            continue;
        }

        if (ch === ',') {
            output += ',';
            if (i + 1 < content.length && content[i + 1] !== ' ') {
                output += ' ';
            }
            continue;
        }

        if (ch === '=') {
            const prev = i > 0 ? content[i - 1] : '';
            const next = i + 1 < content.length ? content[i + 1] : '';
            if (prev !== ' ' && prev !== '=' && prev !== '!') {
                output += ' ';
            }
            output += '=';
            if (next !== ' ' && next !== '=' && next !== '') {
                output += ' ';
            }
            continue;
        }

        if (ch === ';') {
            output += ';';
            continue;
        }

        output += ch;
    }

    state.inString = inString;
    return output.replace(/[ \t]+$/, '');
}

function formatLine(line: string, state: FormatterState): string | string[] {
    const start = line.replace(/^[ \t]+/, '');
    if (start.length === 0) {
        return '';
    }

    const hasBlockStart = isBlockCommentStart(start);
    const hasBlockEnd = isBlockCommentEnd(start);
    if (hasBlockStart) {
        state.inBlockComment = true;
    }
    if (hasBlockEnd) {
        state.inBlockComment = false;
    }

    if (state.inBlockComment || isCommentLine(start) || hasBlockStart || hasBlockEnd) {
        return `${' '.repeat(state.indentLevel * state.indentSize)}${start}`;
    }

    const bracePos = findUnquotedChar(start, '{', state.inString);
    const closeBracePos = findUnquotedChar(start, '}', state.inString);

    if (bracePos >= 0) {
        const afterBrace = start.slice(bracePos + 1).trimStart();
        const hasContentAfterBrace = afterBrace.length > 0 && !isOnlyCommentOrWhitespace(afterBrace);

        if (hasContentAfterBrace) {
            const beforeBrace = start.slice(0, bracePos).trimEnd();
            const indent = ' '.repeat(state.indentLevel * state.indentSize);
            state.indentLevel += 1;
            const innerIndent = ' '.repeat(state.indentLevel * state.indentSize);
            const firstLine = beforeBrace.length > 0
                ? `${indent}${formatLineContent(beforeBrace, state)} {`
                : `${indent}{`;
            const secondLine = `${innerIndent}${formatLineContent(afterBrace, state)}`;
            return [firstLine, secondLine];
        }

        if (isStructuralOpenBrace(start, bracePos)) {
            const beforeBrace = start.slice(0, bracePos).trimEnd();
            const indent = ' '.repeat(state.indentLevel * state.indentSize);
            if (beforeBrace.length > 0) {
                state.indentLevel += 1;
                return `${indent}${formatLineContent(beforeBrace, state)} {`;
            }
            state.indentLevel += 1;
            return `${indent}{`;
        }
    }

    if (closeBracePos >= 0 && isStructuralCloseBrace(start)) {
        state.indentLevel = Math.max(0, state.indentLevel - 1);
        const afterBrace = start.slice(closeBracePos + 1).trimStart();
        const indent = ' '.repeat(state.indentLevel * state.indentSize);
        if (afterBrace.length > 0) {
            return `${indent}} ${formatLineContent(afterBrace, state)}`;
        }
        return `${indent}}`;
    }

    return `${' '.repeat(state.indentLevel * state.indentSize)}${formatLineContent(start, state)}`;
}

function formatDocument(text: string, indentSize: number): string {
    const state: FormatterState = {
        indentSize,
        indentLevel: 0,
        inBlockComment: false,
        inString: false
    };

    const results = text
        .split(/\r?\n/)
        .map((line) => formatLine(line, state));
    const lines = results.flatMap((r) => (Array.isArray(r) ? r : [r]));
    return lines.join('\n');
}

class MBDFFormattingProvider implements vscode.DocumentFormattingEditProvider {
    async provideDocumentFormattingEdits(
        document: vscode.TextDocument
    ): Promise<vscode.TextEdit[]> {
        try {
            const config = vscode.workspace.getConfiguration('mbdf.formatter');
            const indentSize = config.get<number>('indentSize', 4);
            const formatted = formatDocument(document.getText(), indentSize);
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );
            return [vscode.TextEdit.replace(fullRange, formatted)];
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`MBDF Formatting Error: ${message}`);
            return [];
        }
    }
}

export function activate(context: vscode.ExtensionContext): void {
    const provider = new MBDFFormattingProvider();
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('mbdf', provider)
    );

    const formatCommand = vscode.commands.registerCommand('mbdf.formatDocument', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }
        if (editor.document.languageId !== 'mbdf') {
            vscode.window.showWarningMessage('Current file is not a MBDF file');
            return;
        }
        await vscode.commands.executeCommand('editor.action.formatDocument');
    });
    context.subscriptions.push(formatCommand);

    const formatSelectionCommand = vscode.commands.registerCommand('mbdf.formatSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }
        if (editor.document.languageId !== 'mbdf') {
            vscode.window.showWarningMessage('Current file is not a MBDF file');
            return;
        }
        await vscode.commands.executeCommand('editor.action.formatDocument');
    });
    context.subscriptions.push(formatSelectionCommand);

    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = '$(paintcan) MBDF Format';
    statusBar.command = 'mbdf.formatDocument';
    const statusConfig = vscode.workspace.getConfiguration('mbdf.formatter');
    const versionLabel = statusConfig.get<string>('version', '1.0.0');
    statusBar.tooltip = `MBDF Formatter v${versionLabel}`;
    context.subscriptions.push(statusBar);

    const updateStatusBar = () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'mbdf') {
            statusBar.show();
        } else {
            statusBar.hide();
        }
    };

    updateStatusBar();
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(updateStatusBar));

    const config = vscode.workspace.getConfiguration('mbdf.formatter');
    if (config.get<boolean>('formatOnSave', false)) {
        const onSave = vscode.workspace.onDidSaveTextDocument((document) => {
            if (document.languageId === 'mbdf') {
                vscode.commands.executeCommand('editor.action.formatDocument');
            }
        });
        context.subscriptions.push(onSave);
    }
}

export function deactivate(): void {}
