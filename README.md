# IntelliSense for CSS class names

A Visual Studio Code extension that provides CSS class name completion for the HTML `class` attribute based on the CSS files in your workspace. Also supports React's `className` attribute.

![](http://i.imgur.com/5crMfTj.gif)

## Features
* Provides class name completion from class definitions found on your current workspace
* Command to manually re-cache the class definitions used on the auto completion

## Supported Language Modes
* HTML
* JavaScript
* JavaScript React (.jsx)
* TypeScript React (.tsx)
* Vue (.vue) [requires [vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)]

## Features on the backlog
* Cache class definitions from style tags
* Cache class definitions from link tags
* Customization of the directories in which the extension will look for class definitions through User Settings
* Support for PHP, Razor, Jade...

You can request new features on the [extension repository on GitHub](https://github.com/Zignd/HTML-CSS-Class-Completion/issues).

## What's new in version 1.2.x (Mai 28, 2017)
### 1.3.0 (Jun 1, 2017)
* Added support for Vue Single File Components. Thanks to github.com/bypatryk.

### 1.2.1 (Mai 28, 2017)
* Rolling back a change that was causing node_modules to be ignored.

Check out the [change log](https://github.com/zignd/HTML-CSS-Class-Completion/blob/1.3.0/CHANGELOG.md) for all updates.

## Usage
If there are HTML files on your workspace the extension automatically starts and look for CSS class definitions. In case new CSS classes are definined or new CSS files are added to the workspace and you also want auto completion for them simply hit the lightning icon you will find on the status bar and execute the command pressing `Ctrl+Shift+P` and then typing "Cache CSS class definitions".

![](http://i.imgur.com/O7NjEUW.gif)
![](http://i.imgur.com/uyiXqMb.gif)