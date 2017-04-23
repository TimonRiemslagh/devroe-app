mainApp.controller('AllSurveysController', ['$scope', 'ActiveList', 'filterFilter', function($scope, ActiveList, filterFilter) {
  if(!sessionStorage.getItem('login')) {
    $location.path('/login');
  }
  
    $scope.activeSurveys = ActiveList.surveys;

    $scope.searchText = "";

    $scope.activeSurveys.forEach(function(survey) {
        survey.options = survey.options.replace(/,/g, ", ");
    });

    $scope.$watch('searchText', function() {

        $scope.filtered = $scope.activeSurveys;

        if($scope.searchText) {
            var searchTerms = $scope.searchText.split(' ');

            searchTerms.forEach(function(term) {
                $scope.filtered = filterFilter($scope.filtered, term);
            });
        }

    }, true);
}]);
