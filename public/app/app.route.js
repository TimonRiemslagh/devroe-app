mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

        when('/login', {
            templateUrl: 'app/components/login/loginView.html', controller: 'LoginController'
        }).

        when('/references', {
            templateUrl: 'app/components/references/referencesView.html', controller: 'ReferencesController'
        }).

        when('/newsurvey', {
            templateUrl: 'app/components/newSurvey/newsurveyView.html', controller: 'NewSurveyController'
        }).

        when('/allsurveys', {
            templateUrl: 'app/components/allSurveys/allsurveysView.html', controller: 'AllSurveysController'
        }).

        otherwise({
            redirectTo: '/newsurvey'
        });

}]);
