import IParseEngine from "./common/parse-engine";
import CssParseEngine from "./types/css-parse-engine";
import HtmlParseEngine from "./types/html-parse-engine";

class ParseEngineRegistry {
    public static getParseEngine(languageId: string): IParseEngine {
        const foundParseEngine = ParseEngineRegistry.registry.find((value) => value.languageId === languageId);

        if (!foundParseEngine) {
            throw new Error(`Could not find a parse engine for the provided language id ("${languageId}").`);
        }

        return foundParseEngine;
    }

    public static get supportedLanguagesIds(): string[] {
        if (!ParseEngineRegistry.languagesIds) {
            ParseEngineRegistry.languagesIds = ParseEngineRegistry.registry.map(
                (parseEngine) => parseEngine.languageId);
        }

        return ParseEngineRegistry.languagesIds;
    }

    private static languagesIds: string[];
    private static registry: IParseEngine[] = [
        new CssParseEngine(),
        new HtmlParseEngine(),
    ];
}

export default ParseEngineRegistry;
