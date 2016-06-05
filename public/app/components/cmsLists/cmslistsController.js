mainApp.controller('CmsListsController', function($scope, $location) {

    $('ul.nav li').removeClass('active');
    $('.cms').addClass("active");

    $scope.title = "dit is de cms lists pagina";

    $scope.goToNewList = function() {
        $location.path('/cms/cmsLists/cmsNewList');
    }

});
