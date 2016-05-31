mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

        when('/login', {
            templateUrl: 'app/components/login/loginView.html', controller: 'LoginController'
        }).

        when('/home', {
            templateUrl: 'app/components/home/homeView.html', controller: 'HomeController'
        }).

        when('/newsurvey', {
            templateUrl: 'app/components/newSurvey/newsurveyView.html', controller: 'NewSurveyController'
        }).

        when('/allsurveys', {
            templateUrl: 'app/components/allSurveys/allsurveysView.html', controller: 'AllSurveysController'
        }).

        otherwise({
            redirectTo: '/home'
        });

}]);
