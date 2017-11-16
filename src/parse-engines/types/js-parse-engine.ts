import * as css from 'css';
import * as vscode from 'vscode';
import CssClassDefinition from '../../common/css-class-definition';
import ParseEngine from '../common/parse-engine';
import SimpleTextDocument from '../common/simple-textdocument';
import CssClassExtractor from '../common/css-class-extractor';

class JsParseEngine implements ParseEngine {
  public languageId: string = 'js';
  public extension: string = 'js';

  public async parse(textDocument: SimpleTextDocument): Promise<CssClassDefinition[]> {
    let code: string = textDocument.getText();

    const matchTemplateString: Array<string> = code.match(/([^`]).([^`]+)/gmi);
    let cssToParse: string = '';
    for (let i = 0; i < matchTemplateString.length; i++) {
      if (matchTemplateString[i].endsWith('css')) {
        cssToParse += matchTemplateString[i + 1] + ' ';
      }
      if (matchTemplateString[i].endsWith('<style jsx>{')) {
        cssToParse += matchTemplateString[i + 1] + ' ';
      }
    }

    cssToParse = cssToParse.replace(/(\$\{[\s]*.*?[\s]*\})/gmi, '0');

    let codeAst: css.Stylesheet = css.parse(cssToParse);

    return CssClassExtractor.extract(codeAst);
  }
}

export default JsParseEngine;