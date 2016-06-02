var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.controller('indexController', function($scope) {
    $scope.users = ["timon"];
});
