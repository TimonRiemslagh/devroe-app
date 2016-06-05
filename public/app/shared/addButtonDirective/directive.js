mainApp.directive('addButton', function() {
    return {
        restrict: 'E',
        scope: {
            text: "@text"
        },
        templateUrl: '/app/shared/addButtonDirective/template.html'
    };
});
