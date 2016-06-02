mainApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

        when('/references', {
            templateUrl: 'app/components/references/referencesView.html', controller: 'ReferencesController'
        }).

        when('/newsurvey', {
            templateUrl: 'app/components/newSurvey/newsurveyView.html', controller: 'NewSurveyController'
        }).

        when('/newsurvey/list/:listId', {
            templateUrl: 'app/components/lists/listView.html', controller: 'ListsController'
        }).

        when('/allsurveys', {
            templateUrl: 'app/components/allSurveys/allsurveysView.html', controller: 'AllSurveysController'
        }).

        otherwise({
            redirectTo: '/newsurvey'
        });

}]);
