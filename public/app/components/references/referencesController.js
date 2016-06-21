mainApp.controller('ReferencesController', ['$scope', 'ActiveList', 'Lightbox', function($scope, ActiveList, Lightbox) {
    $scope.activeRefs = ActiveList.refs;

    $scope.openLightboxModal = function (index) {
        Lightbox.openModal($scope.activeRefs, index);
        console.log('test');
    };
}]);
