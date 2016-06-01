var mainApp = angular.module("mainApp", ['ngRoute']);

var socket = io.connect();
var lists = [];

socket.on('connect', function() {
    socket.on('setAllLists', function(data) {
        lists = data.lists;
    });
});

mainApp.controller('indexController', function($scope) {
    $scope.users = ["timon"];
});
