mainApp.controller('AllSurveysController', function($scope) {

    $('ul.nav li').removeClass('active');
    $('.allSurveys').addClass("active");

    $scope.users = ['timon'];

    socket.emit('getSurveys');

    socket.on('mostRecent', function(data) {
        $scope.$apply(function(){
            $scope.searchResults = data;
        });
    });

    socket.emit('getAllUsers');

    socket.on('allUsers', function(data) {

    });
});
