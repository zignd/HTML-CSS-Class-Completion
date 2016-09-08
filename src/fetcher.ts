'use strict';

import * as vscode from 'vscode';
import ParseEngineRegistry from './parse-engines/parse-engine-registry';

class Fetcher {
    static async findAllParseableDocuments(): Promise<vscode.Uri[]> {
        let include: string = ParseEngineRegistry.supportedLanguagesIds.reduce(
            (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => {
                previousValue += `**/*.${currentValue}`;
                if (currentIndex != array.length - 1) {
                    previousValue += `, `;
                }
                return previousValue;
            }, "");

        let exclude: string = 'node_modules/**/node_modules/**/*';

        let uris = await vscode.workspace.findFiles(include, exclude);
        
        return uris;
    }
}

export default Fetcher;