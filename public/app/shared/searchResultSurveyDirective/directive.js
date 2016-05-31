mainApp.directive('searchResultSurvey', function() {
    return {
        restrict: 'E',
        scope: {
            survey: '='
        },
        templateUrl: '/app/shared/searchResultSurveyDirective/template.html'
    };
});
