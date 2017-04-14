'use strict';

import * as css from 'css';
import * as vscode from 'vscode';
import CssClassDefinition from '../../common/css-class-definition';
import ParseEngine from '../common/parse-engine';
import fs = require('fs');

class CssParseEngine implements ParseEngine {
    public languageId: string = 'css';

    public parse(textDocument: vscode.Uri): CssClassDefinition[] {
        let definitions: CssClassDefinition[] = [];

        try {
            let code: string = fs.readFileSync(textDocument.fsPath).toString();// textDocument.getText();
            let codeAst: css.Stylesheet = css.parse(code);

            // go through each of the rules...
            codeAst.stylesheet.rules.forEach((rule: css.Rule) => {
                // ...of type rule
                if (rule.type === 'rule') {
                    // go through each of the selectors of the current rule
                    rule.selectors.forEach((selector: string) => {
                        let classNameRegex: RegExp = /[.]([\w-]+)/g;
                        var item: RegExpExecArray = null;

                        while (item = classNameRegex.exec(selector)) {
                            definitions.push(new CssClassDefinition(item[1]));
                        }
                    });
                }
            });

        } catch (e) { }
        return definitions;
    }
}

export default CssParseEngine;