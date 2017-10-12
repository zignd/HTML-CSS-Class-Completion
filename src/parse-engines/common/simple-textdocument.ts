/**
 * A minimum standin for vscode.TextDocument that is passed to a `ParseEngine`.
 */
interface SimpleTextDocument {
    languageId:string;
    getText():string;
}

export default SimpleTextDocument;