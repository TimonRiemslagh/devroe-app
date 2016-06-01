mainApp.directive('userDropDown', function() {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: '/app/shared/userDropdownDirective/template.html'
    };
});
