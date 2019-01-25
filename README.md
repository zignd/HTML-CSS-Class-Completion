# IntelliSense for CSS class names in HTML

A Visual Studio Code extension that provides CSS class name completion for the HTML `class` attribute based on the definitions found in your workspace or external files referenced through the `link` element.

![](https://i.imgur.com/5crMfTj.gif)

## Features
* Gives you autocompletion for CSS class definitions that can be found in your workspace (defined in CSS files or the in the file types listed in the Supported Language Modes section)
* Supports external stylesheets referenced through `link` elements in HTML files
* Command to manually re-cache the class definitions used in the autocompletion
* User Settings to override which folders and files should be considered or excluded from the caching process

## Supported Language Modes
* HTML
* Razor
* PHP
* Laravel (Blade)
* JavaScript
* JavaScript React (.jsx)
* TypeScript React (.tsx)
* Vue (.vue) [requires [octref.vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)]
* Twig
* Markdown (.md)
* Embedded Ruby (.html.erb) [requires [rebornix.Ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.Ruby)]
* Handlebars
* EJS (.ejs)
* Django template (django-html)

## Specific Support
* "@apply" directive in CSS, SASS and SCSS Files for [Tailwind CSS](https://tailwindcss.com)
* "className" and "class" in TypeScript React, JavaScript and JavaScript React language modes
* Emmet abbreviations support triggered by typing a "." (comes disabled by default, check the User Settings topic for more information)

## Contributions
You can request new features and contribute to the extension development on its [repository on GitHub](https://github.com/Zignd/HTML-CSS-Class-Completion/issues). Look for an issue you're interested in working on, comment on it to let me know you're working on it and submit your pull request! :D

## What's new in version 1.18 (Jan 25, 2019)
* Added support for Django template (django-html).

Check out the [changelog](https://github.com/zignd/HTML-CSS-Class-Completion/blob/master/CHANGELOG.md) for the current and previous updates.

## Usage
If there are HTML or JS files on your workspace, the extension automatically starts and looks for CSS class definitions. In case new CSS classes are defined, or new CSS files are added to the workspace, and you also want auto-completion for them, just hit the lightning icon on the status bar. Also, you can execute the command by pressing `Ctrl+Shift+P`(`Cmd+Shift+P` for Mac) and then typing "Cache CSS class definitions."

### User Settings
The extension supports a few user settings, changes to these settings will be automatically recognized and the caching process will be re-executed.

#### Folders and Files

You can change the folders and files the extension will consider or exclude during the caching process by setting the following user settings:

* `"html-css-class-completion.includeGlobPattern"` (default: `"**/*.{css,html}"`)
* `"html-css-class-completion.excludeGlobPattern"` (default: `""`)

#### Emmet

Emmet support comes disabled by default, the reason behind this choice is because it the current implementation simply triggers completion when you type a "." (period) and this behavior might be considered a little annoying, but it might change in the future.

Currently it supports the following languages (those are [language identifier](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers)): "html", "razor", "php", "blade", "vue", "twig", "markdown", "erb", "handlebars", "ejs", "typescriptreact", "javascript", "javascriptreact".

* `"html-css-class-completion.enableEmmetSupport"` (default: `false`)

![](https://i.imgur.com/O7NjEUW.gif)
![](https://i.imgur.com/uyiXqMb.gif)
