#CSS Classes

CSS Classes is based on the extension [HTML CSS Class Completion](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) but it was modified to include some bug fixes and changes.


A Visual Studio Code extension that provides CSS class suggestions for the HTML class attribute based on the CSS files on your workspace.


##Features
* Fetches all CSS classes from CSS files (one file at a time) on the current workspace (opened folder), excluding NodeModules folder


##Usage
The extension starts to fetch for CSS classes on CSS files on your workspace as soon as you open a HTML file for the first time. 
A notification will be displayed on the top of your editor stating that this process started and as soon as it finishes another notification is displayed stating the end.
If an error occurred parsing one of the files, a notification with the path to the file will be displayed.

As soon as this initial process finishes you're ready to make use of the extension as in the demonstration above.