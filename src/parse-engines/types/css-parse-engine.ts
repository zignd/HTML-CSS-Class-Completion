import * as css from "css";
import * as vscode from "vscode";
import CssClassDefinition from "../../common/css-class-definition";
import CssClassExtractor from "../common/css-class-extractor";
import IParseEngine from "../common/parse-engine";
import ISimpleTextDocument from "../common/simple-text-document";

class CssParseEngine implements IParseEngine {
    public languageId: string = "css";
    public extension: string = "css";

    public async parse(textDocument: ISimpleTextDocument): Promise<CssClassDefinition[]> {
        const code: string = textDocument.getText();
        const codeAst: css.Stylesheet = css.parse(code);

        return CssClassExtractor.extract(codeAst);
    }
}

export default CssParseEngine;
