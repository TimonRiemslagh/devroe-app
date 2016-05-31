mainApp.controller('AllSurveysController', function($scope) {

    $('ul.nav li').removeClass('active');
    $('.allSurveys').addClass("active");

    socket.emit('getSurveys');

    socket.on('mostRecent', function(data) {
        console.log(data);

        $scope.$apply(function(){
            $scope.searchResults = data;
        });

    });

});
