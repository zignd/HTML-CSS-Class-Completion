import * as Bluebird from 'bluebird';
import * as request from 'request-promise';
import * as css from 'css';
import * as html from 'htmlparser2';
import * as vscode from 'vscode';
import CssClassDefinition from '../../common/css-class-definition';
import CssClassExtractor from '../common/css-class-extractor';
import ParseEngine from '../common/parse-engine';
import SimpleTextDocument from '../common/simple-textdocument';

class HtmlParseEngine implements ParseEngine {
    public languageId: string = 'html';
    public extension: string = 'html';

    public async parse(textDocument: SimpleTextDocument): Promise<CssClassDefinition[]> {
        const definitions: CssClassDefinition[] = [];
        const urls: string[] = [];
        let tag: string;
        let isRelStylesheet: boolean = false;
        let linkHref: string;

        const parser = new html.Parser({
            onopentagname: (name: string) => {
                tag = name;
            },
            onattribute: (name: string, value: string) => {
                if (name === "rel" && value === "stylesheet") {
                    isRelStylesheet = true;
                }

                if (tag === "link" && name === "href" && value.indexOf('http') === 0) {
                    linkHref = value;
                }
            },
            ontext: (text: string) => {
                if (tag === "style") {
                    definitions.push(...CssClassExtractor.extract(css.parse(text)));
                }
            },
            onclosetag: () => {
                if (tag === "link" && isRelStylesheet && linkHref) {
                    urls.push(linkHref);
                }

                isRelStylesheet = false;
                linkHref = null;
            }
        });

        parser.write(textDocument.getText());
        parser.end();

        await Bluebird.map(urls, async (url) => {
            let content = await request.get(url);
            definitions.push(...CssClassExtractor.extract(css.parse(content)));
        }, { concurrency: 10 });
        
        return definitions;
    }
}

export default HtmlParseEngine;