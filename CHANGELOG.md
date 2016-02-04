### 2.1.0 - 04 February 2016
* add support for suggested values for a search parameter with typeahead support, fixed #11
* fix optional parameters on AngularJS 1.4.9, fixed #31 and #34

### 2.0.1 - 14 December 2015
* enter and leave edit mode methods and events was not called every time due ng-if directive, fixed #17
* workaround a small timing issue and enable edit mode explicit on newly added parameters
* allow to override the templateUrl, related to #19

### 2.0.0 - 11 December 2015
* Support to add, delete search parameters and change search parameter's values via ng-model, fixed issue #7, #9 and #10
* change main property of package.json to final build in dist folder, fixes #4
* use ng-if for search parameter input to avoid rendering issues and performance
* Hide in use search parameter suggestions, fixed issue #8
* correctly handle isolation scope of 'placeholder' attribute, fixed #15
* revert change for issue #3, click on container element enables focus, fixed #14
* fixed entering the edit mode by clicking on a search parameter, fixed #3 #14 #21
* fixed browser back behaviour when removing queries, pull request #23
* add option to configure the suggested parameter label text
* allow to specify the display limit of search parameter suggestions
* allow to specify the search throttle time
* add certain events you can subscribe to (enter / leave edit mode, model update)

### 1.1.1 - 03 February 2015
* update README with latest changes to dist files in bower package
* remove leading 'src/' path from template name

### 1.1.0 - 03 February 2015
* Embed template into final build
* Remove setting focus on click on container element, fixed issue #3
* implement a make release target using grunt-bump

### 1.0.0 - 08 December 2014
* Initial release

