/*!
 * angular-advanced-searchbox
 * https://github.com/dnauck/angular-advanced-searchbox
 * Copyright (c) 2016 Nauck IT KG http://www.nauck-it.de/
 * Author: Daniel Nauck <d.nauck(at)nauck-it.de>
 * License: MIT
 */

(function() {

'use strict';

angular.module('angular-advanced-searchbox', [])
    .directive('nitAdvancedSearchbox', function() {
        return {
            restrict: 'E',
            scope: {
                model: '=ngModel',
                parameters: '=',
                parametersLabel: '@',
                parametersDisplayLimit: '=?',
                placeholder: '@',
                searchThrottleTime: '=?'
            },
            replace: true,
            templateUrl: function(element, attr) {
                return attr.templateUrl || 'angular-advanced-searchbox.html';
            },
            controller: [
                '$scope', '$attrs', '$element', '$timeout', '$filter', 'setFocusFor',
                function ($scope, $attrs, $element, $timeout, $filter, setFocusFor) {

                    $scope.parametersLabel = $scope.parametersLabel || 'Parameter Suggestions';
                    $scope.parametersDisplayLimit = $scope.parametersDisplayLimit || 8;
                    $scope.placeholder = $scope.placeholder || 'Search ...';
                    $scope.searchThrottleTime = $scope.searchThrottleTime || 1000;
                    $scope.searchParams = [];
                    $scope.searchQuery = '';
                    $scope.setFocusFor = setFocusFor;
                    var searchThrottleTimer;
                    var changeBuffer = [];

                    $scope.$watch('model', function (newValue, oldValue) {

                        if(angular.equals(newValue, oldValue))
                            return;

                        angular.forEach($scope.model, function (value, key) {
                            if (key === 'query' && $scope.searchQuery !== value) {
                                $scope.searchQuery = value;
                            } else {
                                var paramTemplate = $filter('filter')($scope.parameters, function (param) { return param.key === key; })[0];
                                var searchParams = $filter('filter')($scope.searchParams, function (param) { return param.key === key; });

                                if (paramTemplate !== undefined) {
                                    if (paramTemplate.allowMultiple) {
                                        // ensure array data structure
                                        if(!angular.isArray(value))
                                                value = [value];

                                        // for each value in the value array: check for adding a new parameter or update it's value
                                        value.forEach(function(val, valIndex) {
                                            if (searchParams.some(function (param) { return param.index === valIndex; })) {
                                                var param = searchParams.filter(function (param) {return param.index === valIndex; });
                                                if(param[0].value !== val)
                                                    param[0].value = val;
                                            } else {
                                                $scope.addSearchParam(paramTemplate, val, false);
                                            }
                                        });

                                        // check if there're more search parameters active then values and remove them
                                        if (value.length < searchParams.length) {
                                            for (var i = value.length; i < searchParams.length; i++) {
                                                $scope.removeSearchParam($scope.searchParams.indexOf(searchParams[i]));
                                            }
                                        }
                                    } else {
                                        if (searchParams.length === 0) {
                                            // add param if missing
                                            $scope.addSearchParam(paramTemplate, value, false);
                                        } else {
                                            // update value of parameter if not equal
                                            if(searchParams[0].value !== value)
                                                searchParams[0].value = value;
                                        }
                                    }
                                }
                            }
                        });

                        // delete not existing search parameters from internal state array
                        for (var i = $scope.searchParams.length - 1; i >= 0; i--) {
                            var value = $scope.searchParams[i];
                            if (!$scope.model.hasOwnProperty(value.key)){
                                var index = $scope.searchParams.map(function(e) { return e.key; }).indexOf(value.key);
                                $scope.removeSearchParam(index);
                            }
                        }
                    }, true);

                    $scope.searchParamValueChanged = function (param) {
                        updateModel('change', param.key, param.index, param.value);
                    };

                    $scope.searchQueryChanged = function (query) {
                        updateModel('change', 'query', 0, query);
                    };

                    $scope.enterEditMode = function(e, index) {
                        if(e !== undefined)
                            e.stopPropagation();

                        if (index === undefined)
                            return;

                        var searchParam = $scope.searchParams[index];
                        searchParam.editMode = true;
                        setFocusFor('searchParam:' + searchParam.key);

                        $scope.$emit('advanced-searchbox:enteredEditMode', searchParam);
                    };

                    $scope.leaveEditMode = function(e, index) {
                        if (index === undefined)
                            return;

                        var searchParam = $scope.searchParams[index];
                        searchParam.editMode = false;

                        $scope.$emit('advanced-searchbox:leavedEditMode', searchParam);

                        // remove empty search params
                        if (!searchParam.value)
                            $scope.removeSearchParam(index);
                    };

                    $scope.searchQueryTypeaheadOnSelect = function (item, model, label) {
                        $scope.addSearchParam(item);
                        $scope.searchQuery = '';
                        updateModel('delete', 'query', 0);
                    };

                    $scope.searchParamTypeaheadOnSelect = function (suggestedValue, searchParam) {
                        searchParam.value = suggestedValue;
                        $scope.searchParamValueChanged(searchParam);
                    };

                    $scope.isUnsedParameter = function (value, index) {
                        return $filter('filter')($scope.searchParams, function (param) { return param.key === value.key && !param.allowMultiple; }).length === 0;
                    };

                    $scope.addSearchParam = function (searchParam, value, enterEditModel) {
                        if (enterEditModel === undefined)
                            enterEditModel = true;

                        if (!$scope.isUnsedParameter(searchParam))
                            return;

                        var internalIndex = 0;
                        if(searchParam.allowMultiple)
                            internalIndex = $filter('filter')($scope.searchParams, function (param) { return param.key === searchParam.key; }).length;

                        var newIndex =
                            $scope.searchParams.push(
                                {
                                    key: searchParam.key,
                                    name: searchParam.name,
                                    type: searchParam.type || 'text',
                                    placeholder: searchParam.placeholder,
                                    allowMultiple: searchParam.allowMultiple || false,
                                    suggestedValues: searchParam.suggestedValues || [],
                                    restrictToSuggestedValues: searchParam.restrictToSuggestedValues || false,
                                    index: internalIndex,
                                    value: value || ''
                                }
                            ) - 1;

                        updateModel('add', searchParam.key, internalIndex, value);

                        if (enterEditModel === true)
                            $timeout(function() { $scope.enterEditMode(undefined, newIndex); }, 100);

                        $scope.$emit('advanced-searchbox:addedSearchParam', searchParam);
                    };

                    $scope.removeSearchParam = function (index) {
                        if (index === undefined)
                            return;

                        var searchParam = $scope.searchParams[index];
                        $scope.searchParams.splice(index, 1);

                        // reassign internal index
                        if(searchParam.allowMultiple){
                            var paramsOfSameKey = $filter('filter')($scope.searchParams, function (param) { return param.key === searchParam.key; });

                            for (var i = 0; i < paramsOfSameKey.length; i++) {
                                paramsOfSameKey[i].index = i;
                            }
                        }

                        updateModel('delete', searchParam.key, searchParam.index);

                        $scope.$emit('advanced-searchbox:removedSearchParam', searchParam);
                    };

                    $scope.removeAll = function() {
                        $scope.searchParams.length = 0;
                        $scope.searchQuery = '';

                        $scope.model = {};

                        $scope.$emit('advanced-searchbox:removedAllSearchParam');
                    };

                    $scope.editPrevious = function(currentIndex) {
                        if (currentIndex !== undefined)
                            $scope.leaveEditMode(undefined, currentIndex);

                        if (currentIndex > 0) {
                            $scope.enterEditMode(undefined, currentIndex - 1);
                        } else if ($scope.searchParams.length > 0) {
                            $scope.enterEditMode(undefined, $scope.searchParams.length - 1);
                        } else if ($scope.searchParams.length === 0) {
                            // no search parameter available anymore
                            setFocusFor('searchbox');
                        }
                    };

                    $scope.editNext = function(currentIndex) {
                        if (currentIndex === undefined)
                            return;

                        $scope.leaveEditMode(undefined, currentIndex);

                        //TODO: check if index == array length - 1 -> what then?
                        if (currentIndex < $scope.searchParams.length - 1) {
                            $scope.enterEditMode(undefined, currentIndex + 1);
                        } else {
                            setFocusFor('searchbox');
                        }
                    };

                    $scope.keydown = function(e, searchParamIndex) {
                        var handledKeys = [8, 9, 13, 37, 39];
                        if (handledKeys.indexOf(e.which) === -1)
                            return;

                        var cursorPosition = getCurrentCaretPosition(e.target);

                        if (e.which == 8) { // backspace
                            if (cursorPosition === 0) {
                                e.preventDefault();
                                $scope.editPrevious(searchParamIndex);
                            }

                        } else if (e.which == 9) { // tab
                            if (e.shiftKey) {
                                e.preventDefault();
                                $scope.editPrevious(searchParamIndex);
                            } else {
                                e.preventDefault();
                                $scope.editNext(searchParamIndex);
                            }

                        } else if (e.which == 13) { // enter
                            $scope.editNext(searchParamIndex);

                        } else if (e.which == 37) { // left
                            if (cursorPosition === 0)
                                $scope.editPrevious(searchParamIndex);

                        } else if (e.which == 39) { // right
                            if (cursorPosition === e.target.value.length)
                                $scope.editNext(searchParamIndex);
                        }
                    };

                    function restoreModel() {
                        angular.forEach($scope.model, function (value, key) {
                            if (key === 'query') {
                                $scope.searchQuery = value;
                            } else {
                                var searchParam = $filter('filter')($scope.parameters, function (param) { return param.key === key; })[0];
                                if (searchParam !== undefined)
                                    $scope.addSearchParam(searchParam, value, false);
                            }
                        });
                    }

                    if ($scope.model === undefined) {
                        $scope.model = {};
                    } else {
                        restoreModel();
                    }

                    function updateModel(command, key, index, value) {
                        if (searchThrottleTimer)
                            $timeout.cancel(searchThrottleTimer);

                        // remove all previous entries to the same search key that was not handled yet
                        changeBuffer = $filter('filter')(changeBuffer, function (change) { return change.key !== key && change.index !== index; });
                        // add new change to list
                        changeBuffer.push({
                            command: command,
                            key: key,
                            index: index,
                            value: value
                        });

                        searchThrottleTimer = $timeout(function () {
                            angular.forEach(changeBuffer, function (change) {
                                var searchParam = $filter('filter')($scope.parameters, function (param) { return param.key === key; })[0];
                                if(searchParam && searchParam.allowMultiple){
                                    if(!angular.isArray($scope.model[change.key]))
                                        $scope.model[change.key] = [];

                                    if(change.command === 'delete'){
                                        $scope.model[change.key].splice(change.index, 1);
                                        if($scope.model[change.key].length === 0)
                                            delete $scope.model[change.key];
                                    } else {
                                        $scope.model[change.key][change.index] = change.value;
                                    }
                                } else {
                                    if(change.command === 'delete')
                                        delete $scope.model[change.key];
                                    else
                                        $scope.model[change.key] = change.value;
                                }
                            });

                            changeBuffer.length = 0;

                            $scope.$emit('advanced-searchbox:modelUpdated', $scope.model);

                        }, $scope.searchThrottleTime);
                    }

                    function getCurrentCaretPosition(input) {
                        if (!input)
                            return 0;

                        try {
                            // Firefox & co
                            if (typeof input.selectionStart === 'number') {
                                return input.selectionDirection === 'backward' ? input.selectionStart : input.selectionEnd;

                            } else if (document.selection) { // IE
                                input.focus();
                                var selection = document.selection.createRange();
                                var selectionLength = document.selection.createRange().text.length;
                                selection.moveStart('character', -input.value.length);
                                return selection.text.length - selectionLength;
                            }
                        } catch(err) {
                            // selectionStart is not supported by HTML 5 input type, so jut ignore it
                        }

                        return 0;
                    }
                }
            ]
        };
    })
    .directive('setFocusOn', [
        function() {
            return {
                restrict: 'A',
                link: function($scope, $element, $attrs) {
                    return $scope.$on('advanced-searchbox:setFocusOn', function(e, id) {
                        if (id === $attrs.setFocusOn) {
                            return $element[0].focus();
                        }
                    });
                }
            };
        }
    ])
    .factory('setFocusFor', [
        '$rootScope', '$timeout',
        function($rootScope, $timeout) {
            return function(id) {
                return $timeout(function() {
                    return $rootScope.$broadcast('advanced-searchbox:setFocusOn', id);
                });
            };
        }
    ])
    .directive('nitAutoSizeInput', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                scope: {
                    model: '=ngModel'
                },
                link: function($scope, $element, $attrs) {
                    var supportedInputTypes = ['text', 'search', 'tel', 'url', 'email', 'password', 'number'];


                    var container = angular.element('<div style="position: fixed; top: -9999px; left: 0px;"></div>');
                    var shadow = angular.element('<span style="white-space:pre;"></span>');

                    var maxWidth = $element.css('maxWidth') === 'none' ? $element.parent().innerWidth() : $element.css('maxWidth');
                    $element.css('maxWidth', maxWidth);

                    angular.forEach([
                        'fontSize', 'fontFamily', 'fontWeight', 'fontStyle',
                        'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent',
                        'boxSizing', 'borderLeftWidth', 'borderRightWidth', 'borderLeftStyle', 'borderRightStyle',
                        'paddingLeft', 'paddingRight', 'marginLeft', 'marginRight'
                    ], function(css) {
                        shadow.css(css, $element.css(css));
                    });

                    angular.element('body').append(container.append(shadow));

                    function resize() {
                        $timeout(function() {
                            if(supportedInputTypes.indexOf($element[0].type || 'text') === -1)
                                return;

                            shadow.text($element.val() || $element.attr('placeholder'));
                            $element.css('width', shadow.outerWidth() + 10);
                        });
                    }

                    resize();

                    if ($scope.model) {
                        $scope.$watch('model', function() { resize(); });
                    } else {
                        $element.on('keypress keyup keydown focus input propertychange change', function() { resize(); });
                    }
                }
            };
        }
    ]);
})();
