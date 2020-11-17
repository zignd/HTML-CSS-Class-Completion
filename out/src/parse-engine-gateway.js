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
const fs = require("fs");
const parse_engine_registry_1 = require("./parse-engines/parse-engine-registry");
function readFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.readFile(file, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data.toString());
            });
        });
    });
}
function createSimpleTextDocument(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = yield readFile(uri.fsPath);
        const simpleDocument = {
            languageId: uri.fsPath.split(".").pop(),
            getText() {
                return text;
            },
        };
        return simpleDocument;
    });
}
class ParseEngineGateway {
    static callParser(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const textDocument = yield createSimpleTextDocument(uri);
            const parseEngine = parse_engine_registry_1.default.getParseEngine(textDocument.languageId);
            const cssClassDefinitions = yield parseEngine.parse(textDocument);
            return cssClassDefinitions;
        });
    }
}
exports.default = ParseEngineGateway;
//# sourceMappingURL=parse-engine-gateway.js.map