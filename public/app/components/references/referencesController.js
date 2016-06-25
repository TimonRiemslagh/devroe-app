mainApp.controller('ReferencesController', ['$scope', 'ActiveList', 'Lightbox', function($scope, ActiveList, Lightbox) {
    $scope.activeRefs = ActiveList.refs;

    $scope.openLightboxModal = function (index, subset) {
        Lightbox.openModal(subset, index);
    };
    
}]);
