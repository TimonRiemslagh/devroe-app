mainApp.controller('NewSurveyController', function($scope, $routeParams) {

    if (typeof(Storage) !== "undefined") {
        alert('localstorage available');
    } else {
        // Sorry! No Web Storage support..
    }

    console.log($routeParams.stepid);

    $('ul.nav li').removeClass('active');
    $('.newSurvey').addClass("active");

    $scope.title = "nieuwe opmeting";

});
