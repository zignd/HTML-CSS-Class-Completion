"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const Bluebird = require("bluebird");
const _ = require("lodash");
require("source-map-support/register");
const VError = require("verror");
const vscode_1 = require("vscode");
const fetcher_1 = require("./fetcher");
const notifier_1 = require("./notifier");
const parse_engine_gateway_1 = require("./parse-engine-gateway");
const notifier = new notifier_1.default("html-css-class-completion.cache");
let uniqueDefinitions = [];
const completionTriggerChars = ['"', "'", " ", "."];
let caching = false;
const emmetDisposables = [];
function cache() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            notifier.notify("eye", "Looking for CSS classes in the workspace...");
            console.log("Looking for parseable documents...");
            const uris = yield fetcher_1.default.findAllParseableDocuments();
            if (!uris || uris.length === 0) {
                console.log("Found no documents");
                notifier.statusBarItem.hide();
                return;
            }
            console.log("Found all parseable documents.");
            const definitions = [];
            let filesParsed = 0;
            let failedLogs = "";
            let failedLogsCount = 0;
            console.log("Parsing documents and looking for CSS class definitions...");
            try {
                yield Bluebird.map(uris, (uri) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        Array.prototype.push.apply(definitions, yield parse_engine_gateway_1.default.callParser(uri));
                    }
                    catch (error) {
                        failedLogs += `${uri.path}\n`;
                        failedLogsCount++;
                    }
                    filesParsed++;
                    const progress = ((filesParsed / uris.length) * 100).toFixed(2);
                    notifier.notify("eye", "Looking for CSS classes in the workspace... (" + progress + "%)", false);
                }), { concurrency: 30 });
            }
            catch (err) {
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
        }
        catch (err) {
            notifier.notify("alert", "Failed to cache the CSS classes in the workspace (click for another attempt)");
            throw new VError(err, "Failed to cache the class definitions during the iterations over the documents that were found");
        }
    });
}
function provideCompletionItemsGenerator(languageSelector, classMatchRegex, classPrefix = "", splitChar = " ") {
    return vscode_1.languages.registerCompletionItemProvider(languageSelector, {
        provideCompletionItems(document, position) {
            const start = new vscode_1.Position(position.line, 0);
            const range = new vscode_1.Range(start, position);
            const text = document.getText(range);
            // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            const rawClasses = text.match(classMatchRegex);
            if (!rawClasses || rawClasses.length === 1) {
                return [];
            }
            // Will store the classes found on the class attribute
            const classesOnAttribute = rawClasses[1].split(splitChar);
            // Creates a collection of CompletionItem based on the classes already cached
            const completionItems = uniqueDefinitions.map((definition) => {
                const completionItem = new vscode_1.CompletionItem(definition.className, vscode_1.CompletionItemKind.Variable);
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
function enableEmmetSupport(disposables) {
    const emmetRegex = /(?=\.)([\w-\. ]*$)/;
    const languageModes = ["html", "django-html", "razor", "php", "blade", "vue", "twig", "markdown", "erb",
        "handlebars", "ejs", "typescriptreact", "javascript", "javascriptreact"];
    languageModes.forEach((language) => {
        emmetDisposables.push(provideCompletionItemsGenerator(language, emmetRegex, "", "."));
    });
}
function disableEmmetSupport(disposables) {
    for (const emmetDisposable of disposables) {
        emmetDisposable.dispose();
    }
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const disposables = [];
        vscode_1.workspace.onDidChangeConfiguration((e) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (e.affectsConfiguration("html-css-class-completion.includeGlobPattern") ||
                    e.affectsConfiguration("html-css-class-completion.excludeGlobPattern")) {
                    yield cache();
                }
                if (e.affectsConfiguration("html-css-class-completion.enableEmmetSupport")) {
                    const isEnabled = vscode_1.workspace.getConfiguration()
                        .get("html-css-class-completion.enableEmmetSupport");
                    isEnabled ? enableEmmetSupport(emmetDisposables) : disableEmmetSupport(emmetDisposables);
                }
            }
            catch (err) {
                err = new VError(err, "Failed to automatically reload the extension after the configuration change");
                console.error(err);
                vscode_1.window.showErrorMessage(err.message);
            }
        }), null, disposables);
        context.subscriptions.push(...disposables);
        context.subscriptions.push(vscode_1.commands.registerCommand("html-css-class-completion.cache", () => __awaiter(this, void 0, void 0, function* () {
            if (caching) {
                return;
            }
            caching = true;
            try {
                yield cache();
            }
            catch (err) {
                err = new VError(err, "Failed to cache the CSS classes in the workspace");
                console.error(err);
                vscode_1.window.showErrorMessage(err.message);
            }
            finally {
                caching = false;
            }
        })));
        // Enable Emmet Completion on startup if param is set to true
        if (vscode_1.workspace.getConfiguration().get("html-css-class-completion.enableEmmetSupport")) {
            enableEmmetSupport(emmetDisposables);
        }
        // Javascript based extensions
        vscode_1.workspace.getConfiguration().get("html-css-class-completion.enabledJavascriptLanguages").forEach((extension) => {
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /className=["|']([\w- ]*$)/));
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/));
        });
        // HTML based extensions
        vscode_1.workspace.getConfiguration().get("html-css-class-completion.enabledHTMLLanguages").forEach((extension) => {
            console.log(extension);
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /class=["|']([\w- ]*$)/));
        });
        // CSS based extensions
        ["css", "sass", "scss"].forEach((extension) => {
            // Support for Tailwind CSS
            context.subscriptions.push(provideCompletionItemsGenerator(extension, /@apply ([\.\w- ]*$)/, "."));
        });
        caching = true;
        try {
            yield cache();
        }
        catch (err) {
            err = new VError(err, "Failed to cache the CSS classes in the workspace for the first time");
            console.error(err);
            vscode_1.window.showErrorMessage(err.message);
        }
        finally {
            caching = false;
        }
    });
}
exports.activate = activate;
function deactivate() {
    emmetDisposables.forEach((disposable) => disposable.dispose());
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map