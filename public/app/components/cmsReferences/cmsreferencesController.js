mainApp.controller('CmsReferencesController', ['$scope', 'ActiveList', '$location', function($scope, ActiveList, $location) {

    $scope.activeRefs = ActiveList.refs;

    console.log($scope.activeRefs);

    $scope.goToNewRef = function() {
        $location.path('/cms/cmsReferences/cmsNewReference');
    };
    
    $scope.edit = function(id) {
        $location.path('/cms/cmsReferences/cmsNewReference/' + id);
    };
    
    $scope.delete = function(id) {
        
    };

}]);

