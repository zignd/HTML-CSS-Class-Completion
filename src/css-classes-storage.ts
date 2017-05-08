import CssClassDefinition from './common/css-class-definition';

class CssClassesStorage {
    private classes: CssClassDefinition[] = [];

    public getClasses(): CssClassDefinition[] {
        return this.classes;
    }
}

export default CssClassesStorage;