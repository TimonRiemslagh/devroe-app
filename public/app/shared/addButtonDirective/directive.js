mainApp.directive('addButton', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            text: "@text"
        },
        templateUrl: '/app/shared/addButtonDirective/template.html'
    };
});
