import * as vscode from 'vscode';
import ParseEngineRegistry from './parse-engines/parse-engine-registry';

class Fetcher {
    static async findAllParseableDocuments(): Promise<vscode.Uri[]> {
        const languages = ParseEngineRegistry.supportedLanguagesIds.join(',');

        const includeGlobPattern = vscode.workspace.getConfiguration().get('css-class-completion.includeGlobPattern');
        const excludeGlobPattern = vscode.workspace.getConfiguration().get('css-class-completion.excludeGlobPattern');

        return await vscode.workspace.findFiles(`${includeGlobPattern}.{${languages}}`, `${excludeGlobPattern}`);
    }
}

export default Fetcher;