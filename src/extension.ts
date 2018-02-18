import * as Bluebird from "bluebird";
import * as _ from "lodash";
import "source-map-support/register";
import * as VError from "verror";
import {
    commands, CompletionItem, CompletionItemKind, Disposable,
    ExtensionContext, languages, Position, Range, TextDocument, Uri, window,
    workspace,
} from "vscode";
import CssClassDefinition from "./common/css-class-definition";
import CssClassesStorage from "./css-classes-storage";
import Fetcher from "./fetcher";
import Notifier from "./notifier";
import ParseEngineGateway from "./parse-engine-gateway";

const notifier: Notifier = new Notifier("html-css-class-completion.cache");
let uniqueDefinitions: CssClassDefinition[] = [];

const completionTriggerChars = ['"', "'", " ", "."];

let caching: boolean = false;

const emmetDisposables: Array<{ dispose(): any }> = [];

async function cache(): Promise<void> {
    try {
        notifier.notify("eye", "Looking for CSS classes in the workspace...");

        console.log("Looking for parseable documents...");
        const uris: Uri[] = await Fetcher.findAllParseableDocuments();

        if (!uris || uris.length === 0) {
            console.log("Found no documents");
            notifier.statusBarItem.hide();
            return;
        }

        console.log("Found all parseable documents.");
        const definitions: CssClassDefinition[] = [];

        let filesParsed: number = 0;
        let failedLogs: string = "";
        let failedLogsCount: number = 0;

        console.log("Parsing documents and looking for CSS class definitions...");

        try {
            await Bluebird.map(uris, async (uri) => {
                try {
                    Array.prototype.push.apply(definitions, await ParseEngineGateway.callParser(uri));
                } catch (error) {
                    failedLogs += `${uri.path}\n`;
                    failedLogsCount++;
                }
                filesParsed++;
                const progress = ((filesParsed / uris.length) * 100).toFixed(2);
                notifier.notify("eye", "Looking for CSS classes in the workspace... (" + progress + "%)", false);
            }, { concurrency: 30 });
        } catch (err) {
            notifier.notify("alert", "Failed to cache the CSS classes in the workspace (click for another attempt)");
            throw new VError(err, "Failed to parse the documents");
        }

        uniqueDefinitions = _.uniqBy(definitions, (def) => def.className);

        console.log("Summary:");
        console.log(uris.length, "parseable documents found");
        console.log(definitions.length, "CSS class definitions found");
        console.log(uniqueDefinitions.length, "unique CSS class definitions found");
        console.log(failedLogsCount, "failed attempts to parse. List of the documents:");
        console.log(failedLogs);

        notifier.notify("zap", "CSS classes cached (click to cache again)");
    } catch (err) {
        notifier.notify("alert", "Failed to cache the CSS classes in the workspace (click for another attempt)");
        throw new VError(err,
            "Failed to cache the class definitions during the iterations over the documents that were found");
    }
}

function provideCompletionItemsGenerator(languageSelector: string, classMatchRegex: RegExp,
                                         classPrefix: string = "", splitChar: string = " ") {
    return languages.registerCompletionItemProvider(languageSelector, {
        provideCompletionItems(document: TextDocument, position: Position): CompletionItem[] {
            const start: Position = new Position(position.line, 0);
            const range: Range = new Range(start, position);
            const text: string = document.getText(range);

            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            const rawClasses: RegExpMatchArray = text.match(classMatchRegex);
            if (!rawClasses || rawClasses.length === 1) {
                return [];
            }

            // Will store the classes found on the class attribute
            const classesOnAttribute = rawClasses[1].split(splitChar);

            // Creates a collection of CompletionItem based on the classes already cached
            const completionItems = uniqueDefinitions.map((definition) => {
                const completionItem = new CompletionItem(definition.className, CompletionItemKind.Variable);
                const completionClassName = `${classPrefix}${definition.className}`;

                completionItem.filterText = completionClassName;
                completionItem.insertText = completionClassName;

                return completionItem;
            });

            // Removes from the collection the classes already specified on the class attribute
            for (const classOnAttribute of classesOnAttribute) {
                for (let j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].insertText === classOnAttribute) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        },
    }, ...completionTriggerChars);
}

function enableEmmetSupport(disposables: Disposable[]) {
    const emmetRegex = /(?=\.)([\w-\. ]*$)/;
    const languageModes = ["html", "razor", "php", "blade", "vue", "twig", "markdown", "erb",
        "handlebars", "ejs", "typescriptreact", "javascript", "javascriptreact"];
    languageModes.forEach((language) => {
        emmetDisposables.push(provideCompletionItemsGenerator(language, emmetRegex, "", "."));
    });
}

function disableEmmetSupport(disposables: Disposable[]) {
    for (const emmetDisposable of disposables) {
        emmetDisposable.dispose();
    }
}

export async function activate(context: ExtensionContext): Promise<void> {
    const disposables: Disposable[] = [];
    workspace.onDidChangeConfiguration(async (e) => {
        try {
            if (e.affectsConfiguration("html-css-class-completion.includeGlobPattern") ||
                e.affectsConfiguration("html-css-class-completion.excludeGlobPattern")) {
                await cache();
            }

            if (e.affectsConfiguration("html-css-class-completion.enableEmmetSupport")) {
                const isEnabled = workspace.getConfiguration()
                    .get<boolean>("html-css-class-completion.enableEmmetSupport");
                isEnabled ? enableEmmetSupport(emmetDisposables) :  disableEmmetSupport(emmetDisposables);
            }
        } catch (err) {
            err = new VError(err, "Failed to automatically reload the extension after the configuration change");
            console.error(err);
            window.showErrorMessage(err.message);
        }
    }, null, disposables);
    context.subscriptions.push(...disposables);

    context.subscriptions.push(commands.registerCommand("html-css-class-completion.cache", async () => {
        if (caching) {
            return;
        }

        caching = true;
        try {
            await cache();
        } catch (err) {
            err = new VError(err, "Failed to cache the CSS classes in the workspace");
            console.error(err);
            window.showErrorMessage(err.message);
        } finally {
            caching = false;
        }
    }));

    // Javascript based extensions
    ["typescriptreact", "javascript", "javascriptreact"].forEach((extension) => {
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /className=["|']([\w- ]*$)/));
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/));
    });

    // HTML based extensions
    ["html", "razor", "php", "blade", "vue", "twig", "markdown", "erb", "handlebars", "ejs"].forEach((extension) => {
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/));
    });

    // CSS based extensions
    ["css", "sass", "scss"].forEach((extension) => {
        // Support for Tailwind CSS
        context.subscriptions.push(provideCompletionItemsGenerator(extension, /@apply ([\.\w- ]*$)/, "."));
    });

    caching = true;
    try {
        await cache();
    } catch (err) {
        err = new VError(err, "Failed to cache the CSS classes in the workspace for the first time");
        console.error(err);
        window.showErrorMessage(err.message);
    } finally {
        caching = false;
    }
}

export function deactivate(): void {
    emmetDisposables.forEach((disposable) => disposable.dispose());
}
