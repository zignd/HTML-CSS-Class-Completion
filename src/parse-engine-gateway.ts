import * as fs from "fs";
import * as vscode from "vscode";

import CssClassDefinition from "./common/css-class-definition";
import IParseEngine from "./parse-engines/common/parse-engine";
import ISimpleTextDocument from "./parse-engines/common/simple-text-document";
import ParseEngineRegistry from "./parse-engines/parse-engine-registry";

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

async function createSimpleTextDocument(uri: vscode.Uri): Promise<ISimpleTextDocument> {
    const text = await readFile(uri.fsPath);
    const simpleDocument: ISimpleTextDocument = {
        languageId: uri.fsPath.split(".").pop(),
        getText(): string {
            return text;
        },
    };
    return simpleDocument;
}

class ParseEngineGateway {
    public static async callParser(uri: vscode.Uri): Promise<CssClassDefinition[]> {
        const textDocument = await createSimpleTextDocument(uri);
        const parseEngine: IParseEngine = ParseEngineRegistry.getParseEngine(textDocument.languageId);
        const cssClassDefinitions: CssClassDefinition[] = await parseEngine.parse(textDocument);
        return cssClassDefinitions;
    }
}

export default ParseEngineGateway;
