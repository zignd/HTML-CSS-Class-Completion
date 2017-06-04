import * as vscode from 'vscode';
import CssClassDefinition from './../../common/css-class-definition';

interface ParseEngine {
    languageId: string;
    extension: string;
    parse(textDocument: vscode.TextDocument): Promise<CssClassDefinition[]>;
}

export default ParseEngine;