mainApp.directive('feedback', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            textSuccess: "=",
            textFail: "=",
            isSuccess: "=",
            error: "=",
            done: "="
        },
        templateUrl: '/app/shared/feedbackDirective/template.html'
    };
});
