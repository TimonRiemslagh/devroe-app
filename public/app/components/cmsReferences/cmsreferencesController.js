mainApp.controller('CmsReferencesController', ['$scope', 'ActiveList', '$location', '$http', function($scope, ActiveList, $location, $http) {

    $scope.activeRefs = ActiveList.refs;

    console.log($scope.activeRefs);

    $scope.goToNewRef = function() {
        $location.path('/cms/cmsReferences/cmsNewReference');
    };
    
    $scope.edit = function(id) {
        $location.path('/cms/cmsReferences/cmsNewReference/' + id);
    };


    
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

