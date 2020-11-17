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
const css = require("css");
const css_class_extractor_1 = require("../common/css-class-extractor");
class CssParseEngine {
    constructor() {
        this.languageId = "css";
        this.extension = "css";
    }
    parse(textDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = textDocument.getText();
            const codeAst = css.parse(code);
            return css_class_extractor_1.default.extract(codeAst);
        });
    }
}
exports.default = CssParseEngine;
//# sourceMappingURL=css-parse-engine.js.map