import * as vscode from 'vscode';
import ParseEngineRegistry from './parse-engines/parse-engine-registry';

class Fetcher {
    static async findAllParseableDocuments(): Promise<vscode.Uri[]> {
        const languages = ParseEngineRegistry.supportedLanguagesIds.join(',');

        return await vscode.workspace.findFiles(`**/*.{${languages}}`, '**/node_modules');
    }
}

export default Fetcher;