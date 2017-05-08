import * as css from 'css';
import CssClassDefinition from '../../common/css-class-definition';

export default class CssClassExtractor {
    /**
     * @description Extracts class names from CSS AST
     */
    static extract(ast: css.Stylesheet): CssClassDefinition[] {
        // TODO can we make this asynchronous?

        const classNameRegex: RegExp = /[.]([\w-]+)/g;

        let definitions: CssClassDefinition[] = [];

        // go through each of the rules...
        ast.stylesheet.rules.forEach((rule: css.Rule) => {
            // ...of type rule
            if (rule.type === 'rule') {
                // go through each of the selectors of the current rule 
                rule.selectors.forEach((selector: string) => {
                    let item: RegExpExecArray = null;

                    while (item = classNameRegex.exec(selector)) {
                        definitions.push(new CssClassDefinition(item[1]));
                    }
                });
            }
        });

        return definitions;
    }
}