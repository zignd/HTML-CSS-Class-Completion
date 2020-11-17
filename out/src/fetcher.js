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
const vscode = require("vscode");
class Fetcher {
    static findAllParseableDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            // There's a bug in the latest version of the API in which calling vscode.workspace.findFiles
            // when the extension is not being executed inside a workspace, causes a "Cannot read property
            // 'map' of undefined" error.
            // More info: https://github.com/zignd/HTML-CSS-Class-Completion/issues/114
            if (!vscode.workspace.name) {
                return [];
            }
            const configuration = vscode.workspace.getConfiguration();
            const includeGlobPattern = configuration.get("html-css-class-completion.includeGlobPattern");
            const excludeGlobPattern = configuration.get("html-css-class-completion.excludeGlobPattern");
            return yield vscode.workspace.findFiles(`${includeGlobPattern}`, `${excludeGlobPattern}`);
        });
    }
}
exports.default = Fetcher;
//# sourceMappingURL=fetcher.js.map