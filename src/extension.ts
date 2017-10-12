import * as async from 'async';
import * as _ from 'lodash';
import * as vscode from 'vscode';
import CssClassDefinition from './common/css-class-definition';
import CssClassesStorage from './css-classes-storage';
import Fetcher from './fetcher';
import Notifier from './notifier';
import ParseEngineGateway from './parse-engine-gateway';

let notifier: Notifier = new Notifier('html-css-class-completion.cache');
let uniqueDefinitions: CssClassDefinition[];

const completionTriggerChars = ['"', '\'', ' '];

function cache(): Promise<void> {
    return new Promise<void>(async (resolve, reject): Promise<void> => {
        try {
            notifier.notify('eye', 'Looking for CSS classes on the workspace...');

            console.log('Looking for parseable documents...');
            let uris: vscode.Uri[] = await Fetcher.findAllParseableDocuments();

            if (!uris) {
                console.log("Found no documents");
                notifier.statusBarItem.hide();
                return;
            }

            console.log('Found all parseable documents.');
            let definitions: CssClassDefinition[] = [];

            let failedLogs: string = '';
            let failedLogsCount: number = 0;

            console.log('Parsing documents and looking for CSS class definitions...');
            return async.eachLimit(uris, 100, async (uri, callback) => {
                try {
                    Array.prototype.push.apply(definitions, await ParseEngineGateway.callParser(uri));
                    callback();
                } catch (error) {
                    failedLogs += `${uri.path}\n`;
                    failedLogsCount++;
                    callback();
                }
            }, (error) => {
                if (error) {
                    console.error('Failed to parse the documents: ', error);
                    return reject(error);
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
            });
        } catch (error) {
            console.error('Failed while looping through the documents to cache the classes definitions:', error);
            notifier.notify('alert', 'Failed to cache the CSS classes on the workspace (click for another attempt)');
            return reject(error);
        }
    });
}

function provideCompletionItemsGenerator(languageSelector: string, classMatchRegex: RegExp) {
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
                return new vscode.CompletionItem(definition.className, vscode.CompletionItemKind.Variable);
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
        await cache();
    }));

    const htmlRegex = /class=["|']([\w- ]*$)/;
    const jsxRegex = /className=["|']([\w- ]*$)/;

    const html = provideCompletionItemsGenerator('html', htmlRegex);
    const razor = provideCompletionItemsGenerator('razor', htmlRegex);
    const php = provideCompletionItemsGenerator('php', htmlRegex);
    const vue = provideCompletionItemsGenerator('vue', htmlRegex);
    const twig = provideCompletionItemsGenerator('twig', htmlRegex);
    const md = provideCompletionItemsGenerator('markdown', htmlRegex);
    const tsReact = provideCompletionItemsGenerator('typescriptreact', jsxRegex);
    const js = provideCompletionItemsGenerator('javascript', jsxRegex)
    const jsReact = provideCompletionItemsGenerator('javascriptreact', jsxRegex);
    const erb = provideCompletionItemsGenerator('erb', htmlRegex);
    const hbs = provideCompletionItemsGenerator('handlebars', htmlRegex);
    const ejs = provideCompletionItemsGenerator('ejs', htmlRegex);

    context.subscriptions.push(html);
    context.subscriptions.push(razor);
    context.subscriptions.push(php);
    context.subscriptions.push(vue);
    context.subscriptions.push(twig);
    context.subscriptions.push(md);
    context.subscriptions.push(tsReact);
    context.subscriptions.push(js);
    context.subscriptions.push(jsReact);
    context.subscriptions.push(erb);
    context.subscriptions.push(hbs);
    context.subscriptions.push(ejs);

    await cache();
}

export function deactivate(): void {
}

// TODO: Look for CSS class definitions automatically in case a new file is added to the workspace. I think the API does not provide and event for that. Maybe I should consider opening a PR.
