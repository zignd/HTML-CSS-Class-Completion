import * as css from "css";
import CssClassDefinition from "../../common/css-class-definition";

export default class CssClassExtractor {
    /**
     * @description Extracts class names from CSS AST
     */
    public static extract(ast: css.Stylesheet): CssClassDefinition[] {
        const classNameRegex = /[.](([\w-]|\\[@:/])+)/g;

        const definitions: CssClassDefinition[] = [];

        // go through each of the selectors of the current rule
        const addRule = (rule: css.Rule) => {
            rule.selectors?.forEach((selector: string) => {
                let item: RegExpExecArray | null = classNameRegex.exec(selector);
                while (item) {
                    definitions.push(new CssClassDefinition(item[1].replace("\\", "")));
                    item = classNameRegex.exec(selector);
                }
            });
        };

        // go through each of the rules or media query...
        ast.stylesheet?.rules.forEach((rule: css.Rule & css.Media) => {
            // ...of type rule
            if (rule.type === "rule") {
                addRule(rule);
            }
            // of type media queries
            if (rule.type === "media") {
                // go through rules inside media queries
                rule.rules?.forEach((rule: css.Rule) => addRule(rule));
            }
        });
        return definitions;
    }
}
