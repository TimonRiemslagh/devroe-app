mainApp.controller('ReferencesController', ['$scope', 'ActiveList', function($scope, ActiveList) {
    $scope.activeRefs = ActiveList.refs;
    console.log($scope.activeRefs);
}]);
