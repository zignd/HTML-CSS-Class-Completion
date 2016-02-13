'use strict';

var vscode = require('vscode');
var css = require('css');
//var cheerio = require('cheerio');

function activate(context) {
    var classes = [];

    function fetchAllCssRulesInCssFiles() {
        vscode.window.showInformationMessage('HTML CSS Class Completion: Fetching CSS rules from CSS files, please wait.');
        // fetches the css files excluding the ones within node_modules folders that are within another node_modules folder
        vscode.workspace.findFiles('**/*.css', 'node_modules/**/node_modules/**/*').then(function (uris) {
            // will contain all the css files concatenated
            var cssFilesConcatenated = "";
            // goes through each css file found and open it
            uris.forEach(function (uri, index) {
                vscode.workspace.openTextDocument(uri).then(function (textDocument) {
                    // extracts the text of the file and concatenates it
                    cssFilesConcatenated += textDocument.getText();
                    if (uris.length == index + 1) {
                        // after finishing the process the css classes are fetched from this large string and added to the classes array
                        fetchClasses(cssFilesConcatenated, classes);
                        vscode.window.showInformationMessage("HTML CSS Class Completion: Finished fetching CSS rules from CSS files.");
                    }
                });
            });
        });
    }

    // function fetchAllCssRulesInHtmlFiles() {
    //     vscode.window.showInformationMessage('HTML CSS Class Completion: Fetching CSS rules from HTML files, please wait.');
    //     vscode.workspace.findFiles('**/*.html', 'node_modules/**/node_modules/**/*').then(function (uris) {
    //         var stylesConcatenated = "";
    //         uris.forEach(function (uri, index) {
    //             vscode.workspace.openTextDocument(uri).then(function (textDocument) {
    //                 var $ = cheerio.load(textDocument.getText());
    //                 var $styles = $('style');
    //                 if ($styles.length > 0) {
    //                     $styles.forEach(function ($style) {
    //                         stylesConcatenated += $style.children[0].data;
    //                     });
    //                 }
    //                 if (uris.length == index + 1) {
    //                     fetchClasses(stylesConcatenated, classes);
    //                     vscode.window.showInformationMessage("HTML CSS Class Completion: Finished fetching CSS rules from HTML files.")
    //                 }
    //             });
    //             return;
    //         });
    //     });
    // }

    function fetchClasses(text, classes) {
        var parsedCss = css.parse(text);
        
        // go through each of the rules...
        parsedCss.stylesheet.rules.forEach(function (rule) {
            // ...of type rule
            if (rule.type === 'rule') {
                // go through each of the selectors of the current rule 
                rule.selectors.forEach(function (selector) {
                    var classesRegex = /[.]([\w-]+)/g;
                    var tempClasses = [];
                    var item = null;
                    
                    // check if the current selector contains class names
                    while (item = classesRegex.exec(selector)) {
                        tempClasses.push(item[1]);
                    }

                    if (tempClasses.length > 0) {
                        // extract class names specified on the current selector
                        // and then go through each of them
                        tempClasses.forEach(function (className) {
                            // check if the current class name is not in the classes array
                            if (classes.indexOf(className) === -1) {
                                // if so adds it to it
                                classes.push(className);
                            }
                        });
                    }
                });
            }
        });

        return classes;
    }

    var disposable = vscode.languages.registerCompletionItemProvider('html', {
        provideCompletionItems(document, position, token) {
            var start = new vscode.Position(position.line, 0);
            var range = new vscode.Range(start, position);
            var text = document.getText(range);
            
            // check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
            var rawClasses = text.match(/class=["|']([\w- ]*$)/); 
            if (rawClasses === null) {
                return [];
            }

            // will store the classes found on the class attribute
            var classesOnAttribute = [];
            // regex to extract the classes found of the class attribute
            var classesRegex = /[ ]*([\w-]*)[ ]*/g;

            var item = null;
            while ((item = classesRegex.exec(rawClasses[1])) !== null) {
                if (item.index === classesRegex.lastIndex) {
                    classesRegex.lastIndex++;
                }
                if (item !== null && item.length > 0) {
                    classesOnAttribute.push(item[1]);
                }
            }
            classesOnAttribute.pop();

            // creates a collection of CompletionItem based on the classes already fetched
            var completionItems = [];
            for (var i = 0; i < classes.length; i++) {
                completionItems.push(new vscode.CompletionItem(classes[i]));
            }
            
            // removes from the collection the classes already specified on the class attribute
            for (var i = 0; i < classesOnAttribute.length; i++) {
                for (var j = 0; j < completionItems.length; j++) {
                    if (completionItems[j].label === classesOnAttribute[i]) {
                        completionItems.splice(j, 1);
                    }
                }
            }

            return completionItems;
        },
        resolveCompletionItem(item, token) {
            return item;
        }
    });
    context.subscriptions.push(disposable);
    
    fetchAllCssRulesInCssFiles();
    //fetchAllCssRulesInHtmlFiles();
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;