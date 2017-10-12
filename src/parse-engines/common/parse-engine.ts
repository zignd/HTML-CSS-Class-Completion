import CssClassDefinition from './../../common/css-class-definition';
import SimpleTextDocument from './simple-textdocument';

interface ParseEngine {
    languageId: string;
    extension: string;
    parse(textDocument: SimpleTextDocument): Promise<CssClassDefinition[]>;
}

export default ParseEngine;