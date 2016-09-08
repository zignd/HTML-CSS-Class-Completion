'use strict';

import ParseEngine from './common/parse-engine';
import CssParseEngine from './types/css-parse-engine';

class ParseEngineRegistry {
    private static _supportedLanguagesIds: string[];
    private static _registry: ParseEngine[] = [
        new CssParseEngine()
    ];

    public static get supportedLanguagesIds(): string[] {
        if (!ParseEngineRegistry._supportedLanguagesIds) {
            ParseEngineRegistry._supportedLanguagesIds = ParseEngineRegistry._registry.reduce<string[]>(
                (previousValue: string[], currentValue: ParseEngine, currentIndex: number, array: ParseEngine[]) => {
                    previousValue.push(currentValue.languageId)
                    return previousValue;
                }, []);
        }

        return ParseEngineRegistry._supportedLanguagesIds;
    }

    public static getParseEngine(languageId: string): ParseEngine {
        let foundParseEngine: ParseEngine = ParseEngineRegistry._registry.find((value: ParseEngine, index: number, obj: ParseEngine[]) => {
            return value.languageId === languageId;
        });

        if (!foundParseEngine) {
            throw `Could not find a parse engine for the provided language id ("${languageId}").`;
        }

        return foundParseEngine;
    }
}

export default ParseEngineRegistry;