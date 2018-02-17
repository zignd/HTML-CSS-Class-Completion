/**
 * A minimum standin for vscode.TextDocument that is passed to a `ParseEngine`.
 */
interface ISimpleTextDocument {
    languageId: string;
    getText(): string;
}

export default ISimpleTextDocument;
