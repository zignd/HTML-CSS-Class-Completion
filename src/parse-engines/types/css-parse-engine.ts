import * as postcss from 'postcss';
import CssClassDefinition from "../../common/css-class-definition";
import CssClassExtractor from "../common/css-class-extractor";
import IParseEngine from "../common/parse-engine";
import ISimpleTextDocument from "../common/simple-text-document";

class CssParseEngine implements IParseEngine {
    public languageId: string = "css";
    public extension: string = "css";

    public async parse(textDocument: ISimpleTextDocument): Promise<CssClassDefinition[]> {
        const code: string = textDocument.getText();
        const result = await postcss().process(code);
        if (!result.root) return [];
        return CssClassExtractor.extract(result.root);
    }
}

export default CssParseEngine;
