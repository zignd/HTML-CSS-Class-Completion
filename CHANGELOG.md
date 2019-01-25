### 1.18 (Jan 25, 2019)
* Added support for Django template (django-html).

### 1.17.1 (Fev 18, 2018)
* Added support for "class" in TypeScript React, JavaScript and JavaScript React language modes. Previously only "className" was supported;
* Added support for Emmet.

### 1.16.2 (Fev 10, 2018)
* Workaround for a bug in the VS Code API.

### 1.16.1 (Jan 15, 2018)
* Fix mistake in production build.

### 1.16.0 (Jan 14, 2018)
* Automatic re-caching when the extension's User Settings change.

### 1.15.0 (Dec 27, 2017)
* Added User Settings to consider or exclude folders and files from the caching process.

### 1.14.0 (Nov 10, 2017)
* Added support for Tailwind CSS's @apply function in CSS, SASS and SCSS.

### 1.13.0 (Nov 6, 2017)
* Added support for Laravel (Blade).

### 1.12.0 (Out 31, 2017)
* Added the "multi-root ready" keyword, it was a request from the VS Code team.

### 1.11.0 (Out 14, 2017)
* Fix error that occurs when you try to get completion and the extension is loading;
* Add limitations to the concurrency in resource-intensive operations;
* Add progress indicator, useful for large projects;
* The `node_modules` will not be ignored. With those changes, it seems that there's no need to ignore it.

### 1.10.2 (Out 12, 2017)
* Temporary fix to prevent high CPU usage. The `node_modules` will be ignored in the search for CSS class definitions. [Link to the issue containing detailed information.](https://github.com/Microsoft/vscode/issues/35996);
* Fix possibility to run the caching process multiple times simultaneously.

### 1.10.1 (Out 12, 2017)
* Temporary fix to prevent high CPU usage. The `node_modules` will be ignored in the search for CSS class definitions. [Link to the issue containing detailed information.](https://github.com/Microsoft/vscode/issues/35996)

### 1.10.0 (Set 9, 2017)
* Added support for EJS.

### 1.9.0 (Ago 27, 2017)
* Added support for Handlebars.

### 1.8.1 (Ago 20, 2017)
* Small parsing related fix.

### 1.8.0 (Jul 22, 2017)
* Added support for Embedded Ruby (.html.erb).

### 1.7.0 (Jun 9, 2017)
* Added support for Markdown.

### 1.6.0 (Jun 4, 2017)
* Added support for Twig.

### 1.5.0 (Jun 4, 2017)
* Added support for external stylesheets referecend through `link` elements in HTML files.

### 1.4.0 (Jun 3, 2017)
* Added support for Razor and PHP.

### 1.3.0 (Jun 1, 2017)
* Added support for Vue Single File Components. Thanks to github.com/bypatryk.

### 1.2.1 (Mai 28, 2017)
* Rolling back a change that was causing node_modules to be ignored.

### 1.2.0 (Mai 9, 2017)
* Now completion gets triggered when you open single quotes, double quotes or types a space character". Thanks to github.com/allevaton;
* Internal refactors. Thanks to github.com/allevaton.

### 1.1.0 (Apr 14, 2017)
* Added support for React's `className` attribute in JavaScript, JavaScript React (.jsx) and TypeScript React files (.tsx). Thanks to github.com/JanneHarju.

### 1.0.3 (Sep 27, 2016)
* Fixed error showing up whenever there were no workspace opened.

### 1.0.2 (Sep 17, 2016)
* Refactored to add proper asynchronous parallel parsing of the documents.
