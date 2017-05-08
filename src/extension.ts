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
            return async.each(uris, async (uri, callback) => {
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

                uniqueDefinitions = _.uniqBy(definitions, (x) => x.className);

                console.log('Sumary:');
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

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(vscode.commands.registerCommand('html-css-class-completion.cache', async () => {
        await cache();
    }));

    await cache();

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('html', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
            let start: vscode.Position = new vscode.Position(position.line, 0);
            let range: vscode.Range = new vscode.Range(start, position);
            let text: string = document.getText(range);

            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            let rawClasses: RegExpMatchArray = text.match(/class=["|']([\w- ]*$)/);
            if (rawClasses === null) {
                return [];
            }

            // Will store the classes found on the class attribute
            var classesOnAttribute: string[] = [];
            // Regex to extract the classes found of the class attribute
            var classesRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;

            var item: RegExpExecArray = null;
            while ((item = classesRegex.exec(rawClasses[1])) !== null) {
                if (item.index === classesRegex.lastIndex) {
                    classesRegex.lastIndex++;
                }
                if (item !== null && item.length > 0) {
                    classesOnAttribute.push(item[1]);
                }
            }
            classesOnAttribute.pop();

            // Creates a collection of CompletionItem based on the classes already cached
            var completionItems: vscode.CompletionItem[] = [];
            for (var i = 0; i < uniqueDefinitions.length; i++) {
                completionItems.push(new vscode.CompletionItem(uniqueDefinitions[i].className, vscode.CompletionItemKind.Variable));
            }

            // Removes from the collection the classes already specified on the class attribute
            for (var i = 0; i < classesOnAttribute.length; i++) {
                for (var j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        }
    }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('typescriptreact', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
            let start: vscode.Position = new vscode.Position(position.line, 0);
            let range: vscode.Range = new vscode.Range(start, position);
            let text: string = document.getText(range);

            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            let rawClasses: RegExpMatchArray = text.match(/className=["|']([\w- ]*$)/);
            if (rawClasses === null) {
                return [];
            }

            // Will store the classes found on the class attribute
            var classesOnAttribute: string[] = [];
            // Regex to extract the classes found of the class attribute
            var classesRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;

            var item: RegExpExecArray = null;
            while ((item = classesRegex.exec(rawClasses[1])) !== null) {
                if (item.index === classesRegex.lastIndex) {
                    classesRegex.lastIndex++;
                }
                if (item !== null && item.length > 0) {
                    classesOnAttribute.push(item[1]);
                }
            }
            classesOnAttribute.pop();

            // Creates a collection of CompletionItem based on the classes already cached
            var completionItems: vscode.CompletionItem[] = [];
            for (var i = 0; i < uniqueDefinitions.length; i++) {
                completionItems.push(new vscode.CompletionItem(uniqueDefinitions[i].className, vscode.CompletionItemKind.Variable));
            }

            // Removes from the collection the classes already specified on the class attribute
            for (var i = 0; i < classesOnAttribute.length; i++) {
                for (var j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        }
    }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
            let start: vscode.Position = new vscode.Position(position.line, 0);
            let range: vscode.Range = new vscode.Range(start, position);
            let text: string = document.getText(range);

            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            let rawClasses: RegExpMatchArray = text.match(/className=["|']([\w- ]*$)/);
            if (rawClasses === null) {
                return [];
            }

            // Will store the classes found on the class attribute
            var classesOnAttribute: string[] = [];
            // Regex to extract the classes found of the class attribute
            var classesRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;

            var item: RegExpExecArray = null;
            while ((item = classesRegex.exec(rawClasses[1])) !== null) {
                if (item.index === classesRegex.lastIndex) {
                    classesRegex.lastIndex++;
                }
                if (item !== null && item.length > 0) {
                    classesOnAttribute.push(item[1]);
                }
            }
            classesOnAttribute.pop();

            // Creates a collection of CompletionItem based on the classes already cached
            var completionItems: vscode.CompletionItem[] = [];
            for (var i = 0; i < uniqueDefinitions.length; i++) {
                completionItems.push(new vscode.CompletionItem(uniqueDefinitions[i].className, vscode.CompletionItemKind.Variable));
            }

            // Removes from the collection the classes already specified on the class attribute
            for (var i = 0; i < classesOnAttribute.length; i++) {
                for (var j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        }
    }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascriptreact', {
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
            let start: vscode.Position = new vscode.Position(position.line, 0);
            let range: vscode.Range = new vscode.Range(start, position);
            let text: string = document.getText(range);

            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            let rawClasses: RegExpMatchArray = text.match(/className=["|']([\w- ]*$)/);
            if (rawClasses === null) {
                return [];
            }

            // Will store the classes found on the class attribute
            var classesOnAttribute: string[] = [];
            // Regex to extract the classes found of the class attribute
            var classesRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;

            
            var item: RegExpExecArray = null;
            while ((item = classesRegex.exec(rawClasses[1])) !== null) {
                if (item.index === classesRegex.lastIndex) {
                    classesRegex.lastIndex++;
                }
                if (item !== null && item.length > 0) {
                    classesOnAttribute.push(item[1]);
                }
            }
            classesOnAttribute.pop();

            // Creates a collection of CompletionItem based on the classes already cached
            var completionItems: vscode.CompletionItem[] = [];
            for (var i = 0; i < uniqueDefinitions.length; i++) {
                completionItems.push(new vscode.CompletionItem(uniqueDefinitions[i].className, vscode.CompletionItemKind.Variable));
            }

            // Removes from the collection the classes already specified on the class attribute
            for (var i = 0; i < classesOnAttribute.length; i++) {
                for (var j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        }
    }));
}

export function deactivate(): void {
}

// TODO: Look for CSS class definitions automatically in case a new file is added to the workspace. I think the API does not provide and event for that. Maybe I should consider opening a PR.