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

                    var localStorageRefs = JSON.parse(localStorage.getItem('refs'));

                    for(var t = localStorageRefs.length-1; t >= 0; t--) {
                        if (localStorageRefs[t]._id == id) {
                            localStorageRefs.splice(t, 1);
                        }
                    }

                    localStorage.setItem('refs', JSON.stringify(localStorageRefs));
                } else {
                    console.log(res.data.err);
                }

            }, function(errorRes) {
                console.log(errorRes);
            });

        }

    };

}]);

