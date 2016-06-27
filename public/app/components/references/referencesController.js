mainApp.controller('ReferencesController', ['$scope', 'ActiveList', 'Lightbox', 'filterFilter', function($scope, ActiveList, Lightbox, filterFilter) {
    $scope.activeRefs = ActiveList.refs;

    $scope.filteredRefs = $scope.activeRefs;

    $scope.searchText = "";

    $scope.openLightboxModal = function (index, subset) {
        Lightbox.openModal(subset, index);
    };

    $scope.$watch('searchText', function() {

        $scope.filteredRefs = $scope.activeRefs;

        if($scope.searchText) {
            var searchTerms = $scope.searchText.split(' ');

            searchTerms.forEach(function(term) {
                $scope.filteredRefs = filterFilter($scope.filteredRefs, term);
            });
        }

    }, true);
    
}]);
