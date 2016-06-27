mainApp.controller('AllSurveysController', ['$scope', 'ActiveList', 'filterFilter', function($scope, ActiveList, filterFilter) {
    $scope.activeSurveys = ActiveList.surveys;

    $scope.searchText = "";

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
