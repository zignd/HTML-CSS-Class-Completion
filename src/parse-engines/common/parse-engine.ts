import CssClassDefinition from "./../../common/css-class-definition";
import ISimpleTextDocument from "./simple-text-document";

interface IParseEngine {
    languageId: string;
    extension: string;
    parse(textDocument: ISimpleTextDocument): Promise<CssClassDefinition[]>;
}

export default IParseEngine;
