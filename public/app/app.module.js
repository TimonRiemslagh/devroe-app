var mainApp = angular.module("mainApp", ['ngRoute']);

var socket = io.connect();

socket.on('connect', function() {
    socket.on('setAllLists', function(data) {
        lists = data.lists;
    });
});
