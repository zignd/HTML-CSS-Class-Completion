# HTML CSS Class Completion

A Visual Studio Code extension that provides CSS class name completion for the HTML `class` attribute based on the CSS files on your workspace.

![](http://i.imgur.com/5crMfTj.gif)

## Features
* Provides class name completion from class definitions found on your current workspace
* Command to manually re-cache the class definitions used on the auto completion

## Features on the backlog
* Cache class definitions from style tags
* Cache class definitions from link tags
* Customization of the directories in which the extension will look for class definitions through User Settings
* Support for PHP, Razor, Jade...

## Changelog
### 1.0.3 (Sep 27, 2016)
* Fixed error showing up whenever there were no workspace opened

### 1.0.2 (Sep 17, 2016)
* Refactored to add proper asynchronous parallel parsing of the documents

## Usage
If there are HTML files on your workspace the extension automatically starts and look for CSS class definitions. In case new CSS classes are definined or new CSS files are added to the workspace and you also want auto completion for them simply hit the lightning icon you will find on the status bar and execute the command pressing `Ctrl+Shift+P` and then typing "Cache CSS class definitions".

![](http://i.imgur.com/O7NjEUW.gif)
![](http://i.imgur.com/uyiXqMb.gif)