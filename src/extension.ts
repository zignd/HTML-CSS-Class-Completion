import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import CssClassDefinition from './common/css-class-definition';
import CssClassesStorage from './css-classes-storage';
import Fetcher from './fetcher';
import Notifier from './notifier';
import ParseEngineGateway from './parse-engine-gateway';

let notifier: Notifier = new Notifier('html-css-class-completion.cache');
let uniqueDefinitions: CssClassDefinition[] = [];

const completionTriggerChars = ['"', '\'', ' ', '.'];

let caching: boolean = false;

function cache(): Promise<void> {
    return new Promise<void>(async (resolve, reject): Promise<void> => {
        try {
            notifier.notify('eye', 'Looking for CSS classes in the workspace...');

            console.log('Looking for parseable documents...');
            let uris: vscode.Uri[] = await Fetcher.findAllParseableDocuments();

            if (!uris) {
                console.log("Found no documents");
                notifier.statusBarItem.hide();
                return;
            }

            console.log('Found all parseable documents.');
            let definitions: CssClassDefinition[] = [];

            let filesParsed: number = 0;
            let failedLogs: string = '';
            let failedLogsCount: number = 0;

            console.log('Parsing documents and looking for CSS class definitions...');

            try {
                await Bluebird.map(uris, async (uri) => {
                    try {
                        Array.prototype.push.apply(definitions, await ParseEngineGateway.callParser(uri));
                    } catch (error) {
                        failedLogs += `${uri.path}\n`;
                        failedLogsCount++;
                    }
                    filesParsed++;
                    notifier.notify('eye', 'Looking for CSS classes in the workspace... (' + ((filesParsed / uris.length) * 100).toFixed(2) + '%)', false);
                }, { concurrency: 30 });
            } catch (err) {
                console.error('Failed to parse the documents: ', err);
                notifier.notify('alert', 'Failed to cache the CSS classes in the workspace (click for another attempt)');
                return reject(err);
            }

            uniqueDefinitions = _.uniqBy(definitions, def => def.className);

            console.log('Summary:');
            console.log(uris.length, 'parseable documents found');
            console.log(definitions.length, 'CSS class definitions found');
            console.log(uniqueDefinitions.length, 'unique CSS class definitions found');
            console.log(failedLogsCount, 'failed attempts to parse. List of the documents:');
            console.log(failedLogs);

            notifier.notify('zap', 'CSS classes cached (click to cache again)');

            return resolve();
        } catch (error) {
            console.error('Failed to cache the class definitions during the iterations over the documents that were found:', error);
            notifier.notify('alert', 'Failed to cache the CSS classes in the workspace (click for another attempt)');
            return reject(error);
        }
    });
}

function provideCompletionItemsGenerator(languageSelector: string, classMatchRegex: RegExp, classPrefix: string = '') {
    return vscode.languages.registerCompletionItemProvider(languageSelector, {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
            const start: vscode.Position = new vscode.Position(position.line, 0);
            const range: vscode.Range = new vscode.Range(start, position);
            const text: string = document.getText(range);

            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            const rawClasses: RegExpMatchArray = text.match(classMatchRegex);
            if (!rawClasses || rawClasses.length === 1) {
                return [];
            }

            // Will store the classes found on the class attribute
            let classesOnAttribute = rawClasses[1].split(' ');

            // Creates a collection of CompletionItem based on the classes already cached
            let completionItems = uniqueDefinitions.map(definition => {
                return new vscode.CompletionItem(`${classPrefix}${definition.className}`, vscode.CompletionItemKind.Variable);
            });

            // Removes from the collection the classes already specified on the class attribute
            for (let i = 0; i < classesOnAttribute.length; i++) {
                for (let j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        }
    }, ...completionTriggerChars);
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(vscode.commands.registerCommand('html-css-class-completion.cache', async () => {
        if (caching)
            return;

        caching = true;
        try {
            await cache();
        } finally {
            caching = false;
        }
    }));

    // Javascript based extensions
    ['typescriptreact', 'javascript', 'javascriptreact'].forEach((extension) => {
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /className=["|']([\w- ]*$)/));
    });

    // HTML based extensions
    ['html', 'razor', 'php', 'blade', 'vue', 'twig', 'markdown', 'erb', 'handlebars', 'ejs'].forEach((extension) => {
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/));
    });

    // CSS based extensions
    ['css', 'sass', 'scss'].forEach((extension) => {
        // Support for Tailwind CSS
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /@apply ([\.\w- ]*$)/, '.'));
    });

    caching = true;
    try {
        await cache();
    } finally {
        caching = false;
    }
}

export function deactivate(): void {
}
