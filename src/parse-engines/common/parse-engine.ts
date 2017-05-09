import * as vscode from 'vscode';
import CssClassDefinition from './../../common/css-class-definition';

interface ParseEngine {
    languageId: string;
    parse(textDocument: vscode.TextDocument): CssClassDefinition[];
}

export default ParseEngine;