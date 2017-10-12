import * as vscode from 'vscode';
import * as fs from 'fs';

import CssClassDefinition from './common/css-class-definition';
import ParseEngine from './parse-engines/common/parse-engine';
import SimpleTextDocument from './parse-engines/common/simple-textdocument';
import ParseEngineRegistry from './parse-engines/parse-engine-registry';

async function readFile(file: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if (err) {
				reject(err);
			}
			resolve(data.toString());
		});
	});
}

async function createSimpleTextDocument(uri:vscode.Uri): Promise<SimpleTextDocument> {
    let text = await readFile(uri.fsPath);
    let simpleDocument:SimpleTextDocument = {
        languageId: uri.fsPath.split('.').pop(),
        getText():string {
            return text;
        }
    }
    return simpleDocument;
}

class ParseEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<CssClassDefinition[]> {
        let textDocument = await createSimpleTextDocument(uri);
        let parseEngine: ParseEngine = ParseEngineRegistry.getParseEngine(textDocument.languageId);
        let cssClassDefinitions: CssClassDefinition[] = await parseEngine.parse(textDocument);
        return cssClassDefinitions;
    }
}

export default ParseEngineGateway;