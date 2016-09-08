'use strict';

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

async function cache(): Promise<void> {
    console.log('HTML CSS Class Completion: Looking for CSS classes on the workspace...');
    notifier.notify('eye', 'Looking for CSS classes on the workspace...');

    let uris: vscode.Uri[] = await Fetcher.findAllParseableDocuments();
    let definitions: CssClassDefinition[] = [];

    try {
        for (let uri of uris) {
            try {
                Array.prototype.push.apply(definitions, await ParseEngineGateway.callParser(uri));
            } catch (error) {
                console.error(`HTML CSS Class Completion: Failed to cache css classes from "${uri}"`);
            }
        }

        uniqueDefinitions = _.uniqBy(definitions, (x) => x.className);
        notifier.notify('zap', 'CSS classes cached (click to cache again)');
    } catch (error) {
        console.error('HTML CSS Class Completion: Failed while looping through the documents to cache the classes definitions:', error);
        notifier.notify('alert', 'Failed to cache the CSS classes on the workspace (click for another attempt)');
    }
}

function registerCompletionItemProvider(): void {
    
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
}

export function deactivate(): void {
}

// TODO: Look for the CSS classes in case a new file is added to the workspace. I think the API does not provide and event for that. Maybe I should consider opening a PR.