import * as css from "css";
import CssClassDefinition from "../../common/css-class-definition";

export default class CssClassExtractor {
    /**
     * @description Extracts class names from CSS AST
     */
    public static extract(ast: css.Stylesheet): CssClassDefinition[] {
        const classNameRegex: RegExp = /[.]([\w-]+)/g;

        const definitions: CssClassDefinition[] = [];

        // go through each of the rules...
        ast.stylesheet.rules.forEach((rule: css.Rule) => {
            // ...of type rule
            if (rule.type === "rule") {
                // go through each of the selectors of the current rule
                rule.selectors.forEach((selector: string) => {
                    let item: RegExpExecArray = classNameRegex.exec(selector);
                    while (item) {
                        definitions.push(new CssClassDefinition(item[1]));
                        item = classNameRegex.exec(selector);
                    }
                });
            }
        });

        return definitions;
    }
}
