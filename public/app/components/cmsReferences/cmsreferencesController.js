mainApp.controller('CmsReferencesController', ['$scope', 'ActiveList', '$location', '$http', 'filterFilter', function($scope, ActiveList, $location, $http, filterFilter) {

    $scope.activeRefs = ActiveList.refs;

    $scope.goToNewRef = function() {
        $location.path('/cms/cmsReferences/cmsNewReference');
    };
    
    $scope.edit = function(id) {
        $location.path('/cms/cmsReferences/cmsNewReference/' + id);
    };

    $scope.searchText = "";

    $scope.$watch('searchText', function() {

        $scope.filteredRefs = $scope.activeRefs;

        if($scope.searchText) {
            var searchTerms = $scope.searchText.split(' ');

            searchTerms.forEach(function(term) {
                $scope.filteredRefs = filterFilter($scope.filteredRefs, term);
            });
        }

    }, true);
    
    $scope.delete = function(id) {

        console.log(id);

        var r = confirm("Deze referentie voorgoed verwijderen?");
        if (r == true) {

            $http.delete('/refs/' + id).then(function(res) {

                console.log(res);

                if(res.data.success) {
                    ActiveList.removeRef(id);
                } else {
                    console.log(res.data.err);
                }

            }, function(errorRes) {
                console.log(errorRes);
            });

        }

    };

}]);

