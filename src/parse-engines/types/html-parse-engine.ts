import * as Bluebird from "bluebird";
import * as css from "css";
import * as html from "htmlparser2";
import * as request from "request-promise";
import * as vscode from "vscode";
import CssClassDefinition from "../../common/css-class-definition";
import CssClassExtractor from "../common/css-class-extractor";
import IParseEngine from "../common/parse-engine";
import ISimpleTextDocument from "../common/simple-text-document";

class HtmlParseEngine implements IParseEngine {
    public languageId: string = "html";
    public extension: string = "html";

    public async parse(textDocument: ISimpleTextDocument): Promise<CssClassDefinition[]> {
        const definitions: CssClassDefinition[] = [];
        const urls: string[] = [];
        let tag: string;
        let isRelStylesheet: boolean = false;
        let linkHref: string;

        const parser = new html.Parser({
            onopentag: (name, attribs) => {
                if (name === "link") {
                    tag = "link";
                    if ("rel" in attribs && attribs.rel === "stylesheet") {
                        isRelStylesheet = true;
                    }
    
                    if ("href" in attribs && attribs.href.trim().indexOf("http") === 0) {
                        linkHref = attribs.href;
                    }
                }
            },
            onclosetag: () => {
                if (tag === "link" && isRelStylesheet && linkHref) {
                    urls.push(linkHref);
                }

                isRelStylesheet = false;
                linkHref = null;
            },
            ontext: (text: string) => {
                if (tag === "style") {
                    definitions.push(...CssClassExtractor.extract(css.parse(text)));
                }
            },
        });

        parser.write(textDocument.getText());
        parser.end();

        await Bluebird.map(urls, async (url) => {
            const content = await request.get(url);
            definitions.push(...CssClassExtractor.extract(css.parse(content)));
        }, { concurrency: 10 });

        return definitions;
    }
}

export default HtmlParseEngine;
