mainApp.controller('AllSurveysController', ['$scope', 'ActiveList', function($scope, ActiveList) {
    $scope.activeSurveys = ActiveList.surveys;
    console.log($scope.activeSurveys);
}]);
