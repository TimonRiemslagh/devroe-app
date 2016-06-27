mainApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, remarks) {

    $scope.remarks = remarks;

    $scope.ok = function () {
        $uibModalInstance.close($scope.remarks);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
