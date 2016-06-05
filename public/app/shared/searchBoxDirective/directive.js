mainApp.directive('searchBox', function() {
    return {
        restrict: 'E',
        scope: {
            placeholder: "@placeholder"
        },
        templateUrl: '/app/shared/searchBoxDirective/template.html'
    };
});
