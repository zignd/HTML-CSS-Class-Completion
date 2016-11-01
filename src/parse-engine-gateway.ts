'use strict';

import * as vscode from 'vscode';
import CssClassDefinition from './common/css-class-definition';
import ParseEngine from './parse-engines/common/parse-engine';
import ParseEngineRegistry from './parse-engines/parse-engine-registry';

class ParseEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<CssClassDefinition[]> {
        // let textDocument = await vscode.workspace.openTextDocument(uri);
        let parseEngine: ParseEngine = ParseEngineRegistry.getParseEngine('css');
        let cssClassDefinitions: CssClassDefinition[] = parseEngine.parse(uri);
        return cssClassDefinitions;
    }
}

export default ParseEngineGateway;