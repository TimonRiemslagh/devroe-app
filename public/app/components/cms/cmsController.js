mainApp.controller('CmsController', function($scope) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.title = "dit is de cms pagina";

});