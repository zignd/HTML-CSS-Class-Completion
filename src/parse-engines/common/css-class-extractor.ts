import * as postcss from 'postcss';
import CssClassDefinition from "../../common/css-class-definition";

export default class CssClassExtractor {
    /**
     * @description Extracts class names from CSS AST
     */
    public static extract(ast: postcss.Root): CssClassDefinition[] {
        const classNameRegex: RegExp = /[.]([\w-]+)/g;

        const definitions: CssClassDefinition[] = [];

        // go through each of the rules...
        ast.walkRules((rule) => {
            // go through each of the selectors of the current rule
            rule.selectors.forEach((selector) => {
                let item: RegExpExecArray = classNameRegex.exec(selector);
                while (item) {
                    definitions.push(new CssClassDefinition(item[1]));
                    item = classNameRegex.exec(selector);
                }
            });
        });

        return definitions;
    }
}
