## Angular Advanced Searchbox
[![Build Status](https://travis-ci.org/dnauck/angular-advanced-searchbox.png?branch=master)](https://travis-ci.org/dnauck/angular-advanced-searchbox)

A directive for AngularJS providing an advanced visual search box.

### [DEMO](http://dnauck.github.io/angular-advanced-searchbox/)

### Usage

Include with Bower

```sh
bower install angular-advanced-searchbox
```

The bower package contains files in the ```dist/```directory with the following names:

- angular-advanced-searchbox.js
- angular-advanced-searchbox.min.js
- angular-advanced-searchbox-tpls.js
- angular-advanced-searchbox-tpls.min.js

Files with the ```min``` suffix are minified versions to be used in production. The files with ```-tpls``` in their name have the directive template bundled. If you don't need the default template use the ```angular-paginate-anything.min.js``` file and provide your own template with the ```templateUrl``` attribute.

Load the JavaScript and CSS, and declare your Angular dependency

```html
<!-- dependency includes -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-animate/angular-animate.min.js"></script>
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">

<!-- optional for auto complete / suggested value feature -->
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>

<!-- angular advanced searchbox includes -->
<link rel="stylesheet" href="bower_components/angular-advanced-searchbox/dist/angular-advanced-searchbox.min.css">
<script src="bower_components/angular-advanced-searchbox/dist/angular-advanced-searchbox-tpls.min.js"></script>
```

```js
angular.module('myModule', ['angular-advanced-searchbox']);
```

Define the available search parameters in your controller:

```js
$scope.availableSearchParams = [
          { key: "name", name: "Name", placeholder: "Name..." },
          { key: "city", name: "City", placeholder: "City..." },
          { key: "country", name: "Country", placeholder: "Country..." },
          { key: "emailAddress", name: "E-Mail", placeholder: "E-Mail...", allowMultiple: true },
          { key: "job", name: "Job", placeholder: "Job..." }
        ];
```

Then in your view

```html
<nit-advanced-searchbox
	ng-model="searchParams"
	parameters="availableSearchParams"
	placeholder="Search...">
</nit-advanced-searchbox>
```

The `angular-advanced-searchbox` directive uses an external template stored in
`angular-advanced-searchbox.html`.  Host it in a place accessible to
your page and set the `template-url` attribute. Note that the `url`
param can be a scope variable as well as a hard-coded string.

### Benefits

* Handles free text search and/or parameterized searches
* Provides suggestions on available search parameters
* Easy to use with mouse or keyboard
* Model could easily be used as ```params``` for Angular's ```$http``` API
* Twitter Bootstrap compatible markup
* Works perfectly together with [angular-paginate-anything](https://github.com/begriffs/angular-paginate-anything) (use ```ng-model``` as ```url-params```)

### Directive Attributes

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ng-model</td>
      <td>Search parameters as object that could be used as <i>params</i> with Angular's <i>$http</i> API.</td>
    </tr>
    <tr>
      <td>parameters</td>
      <td>List of available parameters to search for.</td>
    </tr>
    <tr>
      <td>parametersDisplayLimit</td>
      <td>Maximum number of suggested parameters to display. Default is 8.</td>
    </tr>
    <tr>
      <td>parametersLabel</td>
      <td>Text for the suggested parameters label, e.g. "Parameter Suggestions".</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>Specifies a short hint in the search box</td>
    </tr>
    <tr>
      <td>searchThrottleTime</td>
      <td>Specifies the time in milliseconds to wait for changes in the UI until the ng-model is updated. Default is 1000ms.</td>
    </tr>
  </tbody>
</table>

### Events

The directive emits events as search parameters added (`advanced-searchbox:addedSearchParam`), removed (`advanced-searchbox:removedSearchParam` and `advanced-searchbox:removedAllSearchParam`), enters the edit mode (`advanced-searchbox:enteredEditMode`), leaves the edit mode (`advanced-searchbox:leavedEditMode`) or the search model was updated (`advanced-searchbox:modelUpdated`).
To catch these events do the following:

```js
$scope.$on('advanced-searchbox:addedSearchParam', function (event, searchParameter) {
  ///
});

$scope.$on('advanced-searchbox:removedSearchParam', function (event, searchParameter) {
  ///
});

$scope.$on('advanced-searchbox:removedAllSearchParam', function (event) {
  ///
});

$scope.$on('advanced-searchbox:enteredEditMode', function (event, searchParameter) {
  ///
});

$scope.$on('advanced-searchbox:leavedEditMode', function (event, searchParameter) {
  ///
});

$scope.$on('advanced-searchbox:modelUpdated', function (event, model) {
  ///
});
```

### Available Search Parameters Properties

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>key</td>
      <td>A unique key of the search parameter that is used for the ng-model value.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>name</td>
      <td>A user friendly display name of the search parameter.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>placeholder</td>
      <td>Specifies a short hint in the parameter search box.</td>
      <td>string</td>
    </tr>
    <tr>
      <td>allowMultiple</td>
      <td>Should multiple search parameters of the same key allowed? Output type changes to an array of values. Default is false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td>suggestedValues</td>
      <td>An array of suggested search values, e.g. ['Berlin', 'London', 'Paris'].</td>
      <td>string[]</td>
    </tr>
    <tr>
      <td>restrictToSuggestedValues</td>
      <td>Should it restrict possible search values to the ones from the suggestedValues array? Default is false.</td>
      <td>boolean</td>
    </tr>
  </tbody>
</table>

Full example:

```js
$scope.availableSearchParams = [
          { key: "name", name: "Name", placeholder: "Name..." },
          { key: "city", name: "City", placeholder: "City...", restrictToSuggestedValues: true, suggestedValues: ['Berlin', 'London', 'Paris'] }
          { key: "email", name: "E-Mail", placeholder: "E-Mail...", allowMultiple: true },
        ];
```
