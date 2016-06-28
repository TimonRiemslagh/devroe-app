mainApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, remarks) {

    $scope.remarks = remarks;

    $scope.ok = function () {

        sessionStorage.setItem('remarks', $scope.remarks);

        $uibModalInstance.close($scope.remarks);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
