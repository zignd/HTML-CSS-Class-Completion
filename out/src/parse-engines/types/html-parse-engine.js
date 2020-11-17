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
const Bluebird = require("bluebird");
const css = require("css");
const html = require("htmlparser2");
const request = require("request-promise");
const css_class_extractor_1 = require("../common/css-class-extractor");
class HtmlParseEngine {
    constructor() {
        this.languageId = "html";
        this.extension = "html";
    }
    parse(textDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            const definitions = [];
            const urls = [];
            let tag;
            let isRelStylesheet = false;
            let linkHref;
            const parser = new html.Parser({
                onattribute: (name, value) => {
                    if (name === "rel" && value === "stylesheet") {
                        isRelStylesheet = true;
                    }
                    if (tag === "link" && name === "href" && value.indexOf("http") === 0) {
                        linkHref = value;
                    }
                },
                onclosetag: () => {
                    if (tag === "link" && isRelStylesheet && linkHref) {
                        urls.push(linkHref);
                    }
                    isRelStylesheet = false;
                    linkHref = null;
                },
                onopentagname: (name) => {
                    tag = name;
                },
                ontext: (text) => {
                    if (tag === "style") {
                        definitions.push(...css_class_extractor_1.default.extract(css.parse(text)));
                    }
                },
            });
            parser.write(textDocument.getText());
            parser.end();
            yield Bluebird.map(urls, (url) => __awaiter(this, void 0, void 0, function* () {
                const content = yield request.get(url);
                definitions.push(...css_class_extractor_1.default.extract(css.parse(content)));
            }), { concurrency: 10 });
            return definitions;
        });
    }
}
exports.default = HtmlParseEngine;
//# sourceMappingURL=html-parse-engine.js.map