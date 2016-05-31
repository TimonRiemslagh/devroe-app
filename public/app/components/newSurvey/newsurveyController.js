mainApp.controller('NewSurveyController', function($scope) {

    $('ul.nav li').removeClass('active');
    $('.newSurvey').addClass("active");

    $scope.title = "nieuwe opmeting";

});
