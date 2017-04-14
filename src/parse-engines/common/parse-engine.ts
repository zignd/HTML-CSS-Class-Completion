'use strict';

import * as vscode from 'vscode';
import CssClassDefinition from './../../common/css-class-definition';

interface ParseEngine {
    languageId: string;
    parse(uri: vscode.Uri): CssClassDefinition[];
}

export default ParseEngine;